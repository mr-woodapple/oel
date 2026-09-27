# Setup

This file explains how to setup the app and what external services you need to configure.

## Geoapify configuration

> Geoapify is used to retrieve locations around you when adding a location to a beer log.

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