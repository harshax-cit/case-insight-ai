def evaluate_claim(claim):
    return {
        "decision": "APPROVE",
        "confidence": 0.91,
        "reasoning": [
            "Required documents available",
            "Policy conditions satisfied"
        ],
        "why_not": [
            "Fraud policy not applicable",
            "Escalation rules not triggered"
        ]
    }
