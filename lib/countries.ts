export const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Singapore",
  "UAE",
  "Japan",
  "Other",
] as const;

export const PHONE_CODES = [
  { code: "+91", country: "India" },
  { code: "+1", country: "US/Canada" },
  { code: "+44", country: "UK" },
  { code: "+61", country: "Australia" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+65", country: "Singapore" },
  { code: "+971", country: "UAE" },
  { code: "+81", country: "Japan" },
] as const;
