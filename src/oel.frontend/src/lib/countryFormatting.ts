const countryNames = new Intl.DisplayNames(["de"], { type: "region" });

export function countryName(code: string) {
  return countryNames.of(code) ?? code;
}
