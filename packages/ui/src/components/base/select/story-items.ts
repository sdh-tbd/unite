import type { SelectItemType } from "./select-shared"

/** Shared sample data for the Select stories. */
export const items: SelectItemType[] = [
  { id: "phoenix", label: "Phoenix Baker", supportingText: "@phoenix" },
  { id: "olivia", label: "Olivia Rhye", supportingText: "@olivia" },
  { id: "lana", label: "Lana Steiner", supportingText: "@lana" },
  { id: "demi", label: "Demi Wilkinson", supportingText: "@demi", isDisabled: true },
]
