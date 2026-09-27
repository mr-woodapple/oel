# Publishing

This file contains info about how oel is released and describes the release process itself.

## Container image

The `oel` container image serves the frontend and API from one ASP.NET Core process.
The frontend is available at `/`, and API endpoints remain below `/api`.

Build and run it locally with a SQL Server connection string:

```bash
docker build --file oel --tag oel .
docker run --rm --publish 8080:8080 \
  --env 'ConnectionStrings__DatabaseConnection=Server=host.docker.internal,1433;Database=OelDatabase;User Id=sa;Password=your-password;Encrypt=False;TrustServerCertificate=True' \
  oel
```

## Releases

Oel releases use semantic version tags. Prepare the frontend version before creating the tag:

```powershell
Set-Location .\src\oel.frontend
npm version 1.2.3 --no-git-tag-version
npm install
Set-Location ..\..

git add .\src\oel.frontend\package.json .\src\oel.frontend\package-lock.json
git commit -m "chore(release): v1.2.3"
```

Merge that commit into `main`, then create an annotated tag on the merged commit and push it:

```powershell
git switch main
git pull --ff-only
git tag -a v1.2.3 -m "oel v1.2.3"
git push origin v1.2.3
```