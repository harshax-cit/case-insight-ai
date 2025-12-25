from flask import Blueprint, request, jsonify
from services.ai_engine import evaluate_claim
from services.audit_logger import log_decision

decision_bp = Blueprint("decision", __name__)

@decision_bp.route("/evaluate", methods=["POST"])
def evaluate():
    data = request.json
    result = evaluate_claim(data)
    log_decision(result)
    return jsonify(result)
