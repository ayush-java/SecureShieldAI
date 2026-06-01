from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import json
from datetime import datetime
import os

app = Flask(__name__)

CORS(app)

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

VALID_EMAIL = "admin"
VALID_PASSWORD = "password123"

ALERTS_FILE = "alerts.json"

blocked_ips = set()
failed_login_tracker = {}
blocked_ips.clear()

print("Security trackers reset")

# CREATE alerts.json IF IT DOES NOT EXIST
if not os.path.exists(ALERTS_FILE):

    with open(ALERTS_FILE, "w") as file:
        json.dump([], file)


def load_alerts():

    try:

        with open(ALERTS_FILE, "r") as file:
            return json.load(file)

    except:

        return []


def save_alert(alert):

    alerts = load_alerts()

    if alerts and alerts[0]["type"] == alert["type"]:
        return

    alerts.insert(0, alert)

    with open(ALERTS_FILE, "w") as file:
        json.dump(alerts, file, indent=4)


@app.route("/")
def home():

    return jsonify({
        "message": "SecureShield AI Backend Running"
    })


@app.route("/login", methods=["POST"])
def login():

    try:

        data = request.get_json(silent=True)

        if not data:

            return jsonify({
                "success": False,
                "message": "Invalid request data"
            }), 400

        email = str(data.get("email", ""))
        password = str(data.get("password", ""))

        ip_address = request.remote_addr

        # BLOCKED IP CHECK
        if ip_address != "127.0.0.1" and ip_address in blocked_ips:

            return jsonify({
                "success": False,
                "message": "IP address blocked due to suspicious activity"
            }), 403

        combined_input = f"{email} {password}".upper()

        # SQL INJECTION DETECTION
        suspicious_patterns = [
            "' OR",
            '" OR',
            "1=1",
            "--",
            "DROP TABLE",
            "SELECT *",
            "UNION SELECT"
        ]

        for pattern in suspicious_patterns:

            if pattern.upper() in combined_input:

                sql_alert = {
                    "type": "SQL Injection Attempt",
                    "ip": ip_address,
                    "severity": "HIGH",
                    "message": f"SQL Injection payload detected from {ip_address}",
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }

                save_alert(sql_alert)

                return jsonify({
                    "success": False,
                    "message": "Suspicious activity detected"
                }), 403

        # XSS DETECTION
        xss_patterns = [
            "ALERT(",
            "<SCRIPT>",
            "ONERROR=",
            "<IMG",
            "<SVG",
            "ONLOAD="
        ]

        for pattern in xss_patterns:

            if pattern.upper() in combined_input:

                xss_alert = {
                    "type": "XSS Attempt",
                    "ip": ip_address,
                    "severity": "HIGH",
                    "message": f"Cross-Site Scripting payload detected from {ip_address}",
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }

                save_alert(xss_alert)

                return jsonify({
                    "success": False,
                    "message": "XSS activity detected"
                }), 403

        # SUCCESSFUL LOGIN
        if email == VALID_EMAIL and password == VALID_PASSWORD:

            failed_login_tracker[ip_address] = 0

            return jsonify({
                "success": True,
                "message": "Login successful"
            })

        # FAILED LOGIN TRACKING
        if ip_address not in failed_login_tracker:

            failed_login_tracker[ip_address] = 0

        failed_login_tracker[ip_address] += 1

        # BRUTE FORCE DETECTION
        if failed_login_tracker[ip_address] >= 5:

            if ip_address not in blocked_ips:

                blocked_ips.add(ip_address)

                brute_force_alert = {
                    "type": "Brute Force Attack",
                    "ip": ip_address,
                    "severity": "CRITICAL",
                    "message": f"Multiple failed login attempts detected from {ip_address}",
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }

                save_alert(brute_force_alert)

            return jsonify({
                "success": False,
                "message": "Brute force attack detected"
            }), 403

        # REGULAR FAILED LOGIN
        failed_alert = {
            "type": "Failed Login",
            "ip": ip_address,
            "severity": "LOW",
            "message": f"Failed login attempt from {ip_address}",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        save_alert(failed_alert)

        return jsonify({
            "success": False,
            "message": "Invalid credentials"
        }), 401

    except Exception as e:

        print("ERROR:", e)

        return jsonify({
            "success": False,
            "message": "Internal server error"
        }), 500


@app.route("/alerts", methods=["GET"])
def get_alerts():

    alerts = load_alerts()

    return jsonify(alerts)


@app.route("/ai", methods=["POST"])
def ai_assistant():
    data = request.json

    question = data.get("question")

    with open("alerts.json", "r") as f:
        alerts_data = f.read()

    with open("incidents.json", "r") as f:
        incidents_data = f.read()

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": f"""
You are SecureShield AI, an enterprise SOC cybersecurity analyst assistant.

You ONLY answer cybersecurity and SOC-related questions.

Here is the current SecureShield threat data:

Alerts:
{alerts_data}

Incidents:
{incidents_data}

Use BOTH alerts and incidents data when answering questions.

You can answer:
- brute force attacks
- XSS
- SQL injection
- incidents
- blocked IPs
- threat counts
- attack timelines
- remediation
 - how many incidents are resolved
 - which incidents are escalated
 - highest severity incidents
 - active investigations
 - attack statistics
 - remediation recommendations
"""
                },
                {
                    "role": "user",
                    "content": question
                }
            ]
        )

        ai_response = response.choices[0].message.content

        return jsonify({
            "response": ai_response
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":

    blocked_ips.clear()
    failed_login_tracker.clear()

    app.run(debug=True)