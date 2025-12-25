// src/services/ragServices.ts

export interface RagResponse {
  decision: "APPROVE" | "REJECT" | "REQUEST_INFO";
  confidence: number;
  reasoning: string[];
  whyNot: string[];
  sources: string[];
}

/**
 * RAG-style AI Agent
 * Simulates retrieval + reasoning for Appian IQ
 */
export async function runRagAgent(claim: any): Promise<RagResponse> {
  // 🔹 Retrieved knowledge (simulated)
  const retrievedPolicies = [
    "Flood claims require damage report",
    "Fraud check applies only if anomaly detected",
    "Escalation needed if amount > ₹5,00,000"
  ];

  // 🔹 Reasoning logic (simple & explainable)
  const reasoning: string[] = [];
  const whyNot: string[] = [];

  if (claim.documents?.includes("Damage Report")) {
    reasoning.push("Required damage report is available");
  } else {
    return {
      decision: "REQUEST_INFO",
      confidence: 0.42,
      reasoning: ["Damage report is missing"],
      whyNot: ["Approval blocked due to missing mandatory document"],
      sources: retrievedPolicies
    };
  }

  if (claim.amount && claim.amount > 500000) {
    whyNot.push("Escalation rule not applied: amount within acceptable threshold");
  } else {
    reasoning.push("Claim amount within standard processing range");
  }

  // 🔹 Final response
  return {
    decision: "APPROVE",
    confidence: 0.91,
    reasoning,
    whyNot: [
      "Fraud policy not applicable (no anomaly detected)",
      ...whyNot
    ],
    sources: retrievedPolicies
  };
}
