# oel

The beer library you always needed, but never knew why.

## Beer-log locations

The location picker opens a nested drawer with two options:

- **In der Nähe** asks for browser location permission and suggests up to 20
  nearby places within 1 km. You can also keep just the device coordinates.
- **Manuell** accepts latitude, longitude, and an optional custom name.

Every selection can be renamed before **Ort übernehmen** applies it to the
beer-log form. Cancelling discards the location draft. The log itself is saved
only when the parent form is submitted. Empty coordinates are not treated as
zero; zero is a valid coordinate. Browser location permission is not required
for manual entry. Using the current location fills the coordinates directly;
choosing a nearby suggestion replaces them with that place's coordinates and name.

### Geoapify configuration

Create a key at [Geoapify](https://myprojects.geoapify.com/) and configure
`Geoapify:ApiKey` on the API server, for example with the environment variable
`Geoapify__ApiKey`. Pass that variable to the container as well when using Docker.
Keep the actual key out of source control and frontend `VITE_*` variables.

All provider requests run through the backend; the browser never receives the
key. The HTTP client suppresses URL logging because provider URLs include the
key and location. Device coordinates are sent to Geoapify only after the user
requests nearby suggestions. Browser geolocation requires HTTPS or localhost.

- `GET /api/location/nearby?latitude=48.13715&longitude=11.57612` returns an array
  of `{ id, name, address, latitude, longitude, distance }` suggestions; distance
  is in meters when available.

Invalid inputs return 400. An unconfigured key returns 503, provider failures
return 502, and provider timeouts return 504, without forwarding provider errors.
Coordinates/manual names remain usable when suggestions are unavailable. The frontend
caches queries in memory for five minutes and requests nearby places after the user
chooses to use their current location.
No schema migration is needed: selected names and coordinates use the existing
beer-log location fields. Provider IDs are used for suggestions, not persisted.

Bruno includes a request for the nearby-location endpoint. Verify nearby results
with a configured key, plus invalid coordinates and the missing-key fallback.

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
