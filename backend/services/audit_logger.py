import datetime

def log_decision(result):
    print({
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "decision": result["decision"],
        "confidence": result["confidence"]
    })
