from flask import Flask
from routes.decision import decision_bp
from routes.health import health_bp

app = Flask(__name__)

app.register_blueprint(decision_bp, url_prefix="/api/decision")
app.register_blueprint(health_bp, url_prefix="/api/health")

if __name__ == "__main__":
    app.run(debug=True)
