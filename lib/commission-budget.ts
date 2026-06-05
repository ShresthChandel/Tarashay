import { Currency } from "@/types";
import type { BudgetRange } from "@/types";

export type BudgetOption =
  | "under-5k"
  | "5k-15k"
  | "15k-50k"
  | "above-50k"
  | "flexible";

export function budgetFromOption(option: BudgetOption): BudgetRange {
  switch (option) {
    case "under-5k":
      return { min: 0, max: 5000, currency: Currency.INR };
    case "5k-15k":
      return { min: 5000, max: 15000, currency: Currency.INR };
    case "15k-50k":
      return { min: 15000, max: 50000, currency: Currency.INR };
    case "above-50k":
      return { min: 50000, max: 500000, currency: Currency.INR };
    default:
      return { min: 0, max: 0, currency: Currency.INR };
  }
}
