# Design

This file includes design decisions and explains how certain components work.

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