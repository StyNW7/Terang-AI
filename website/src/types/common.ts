export type EvidenceClassification =
  | "public-source"
  | "internal-restricted-context"
  | "strategic-proposal"
  | "proposal-projection"
  | "survey-data"
  | "illustrative-assumption"
  | "synthetic-demo";

export type StrategyMode = "overview" | "one" | "ace";

export type ProductKey = "events" | "interview";

export type Tone = "neutral" | "brand" | "sky" | "one" | "ace" | "success" | "warning" | "danger" | "navy";

export type FeatureStatus = "existing" | "proposed" | "in-development" | "simulated" | "later";
