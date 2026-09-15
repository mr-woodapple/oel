# oel

The beer library you always needed, but never knew why.

## Beer origin

Beers can optionally store a country of origin. Choose **Herkunftsland** when
creating or editing a beer; **Keine Angabe** leaves it unknown. The selected
country appears in the beer details.

The API exposes supported ISO 3166-1 alpha-2 codes at `GET /api/country` and
accepts `countryCode` in beer POST, PUT, and PATCH requests. Codes are trimmed,
normalized to uppercase, and validated against that list. Beer responses include
the nullable `countryCode`. PUT clears it when omitted or empty; PATCH keeps it
when omitted or null and clears it when empty.

The `AddBeerCountry` migration adds a nullable column without changing existing
beer data. As with other migrations, it is applied automatically at API startup.

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
git tag -a v1.2.3 -m "Oel v1.2.3"
git push origin v1.2.3
```
