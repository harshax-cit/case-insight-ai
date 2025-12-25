
# APPIAN IQ  
### Explainable, Audit-Ready AI for Intelligent Case Decisions

APPIAN IQ is a full-stack decision intelligence system built to demonstrate how **AI can be safely embedded into Appian-style case management workflows**.

Instead of acting as a generic assistant, APPIAN IQ focuses on **trust, explainability, and governance** — the qualities required for real enterprise adoption.

---

## 🚨 Problem

Enterprise case workflows such as insurance claims, compliance approvals, and regulatory reviews face critical issues:

- Policies and SOPs scattered across documents  
- Manual, inconsistent rule interpretation  
- AI outputs with no explainability  
- High SLA breach risk  
- Poor audit and appeal readiness  

In regulated environments, **a decision is only valid if it can be explained and defended**.

---

## 💡 Solution

APPIAN IQ introduces an **AI decision layer** that works alongside case workflows.

The system:
- Retrieves relevant policy knowledge (RAG-style)
- Produces explainable decisions
- Explicitly explains **why other rules did NOT apply**
- Provides confidence scores
- Activates only when risk is detected

This makes AI **accountable, auditable, and enterprise-ready**.

---

## 🧠 Core Ideas

### ⚖️ AI as a Decision Witness  
AI decisions are generated with structured reasoning that can be reviewed, replayed, and defended during audits or appeals.

### ❌ “Why-NOT?” Reasoning  
In addition to explaining why a rule applies, APPIAN IQ explains why other relevant rules were excluded — a critical compliance requirement.

### 🛡️ Silent Guardian Mode  
AI remains unobtrusive during normal cases and activates only when:
- SLA risk is detected  
- Mandatory documents are missing  
- Decision confidence is low  

---

## 🏗️ System Architecture (High Level)

---

## 🖥️ Frontend

The frontend represents the **decision experience layer** for agents and reviewers.

### Responsibilities
- Display case context
- Trigger AI evaluations
- Visualize decision, confidence, and reasoning
- Surface “why-not” explanations
- Show risk and SLA indicators

### Tech Stack
- React  
- TypeScript  
- Vite  
- Tailwind CSS  

The UI is intentionally minimal and enterprise-grade, aligned with Appian’s design philosophy.

---

## 🔧 Backend

The backend represents the **decision intelligence layer**.

### Responsibilities
- Evaluate claims using AI logic
- Simulate RAG-style policy retrieval
- Return explainable decision outputs
- Provide confidence scores
- Log decision context for audit readiness

### Tech Stack
- Python  
- Flask  

---

## 🔌 Backend APIs

### Health Check


