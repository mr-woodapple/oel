export const servingFormats = [
  { value: 0, label: "Fass" },
  { value: 1, label: "Dose" },
  { value: 2, label: "Flasche" },
  { value: 3, label: "Anderes" },
] as const;

export type ServingFormat = typeof servingFormats[number]["value"];