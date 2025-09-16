from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import random
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# ==============================
# ✅ MySQL Connection
# ==============================
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="areeb@123",
    database="innovascape"
)
cursor = db.cursor(dictionary=True)


# ==============================
# 🚀 Email Transporter (SMTP - Gmail)
# ==============================
EMAIL_USER = "aribali1804@gmail.com"
EMAIL_PASS = "xpfp szcf fcjl grsw"  # app password

def send_email(to, subject, text, html=None):
    try:
        msg = MIMEMultipart("alternative")
        msg["From"] = EMAIL_USER
        msg["To"] = to
        msg["Subject"] = subject

        part1 = MIMEText(text, "plain")
        msg.attach(part1)

        if html:
            part2 = MIMEText(html, "html")
            msg.attach(part2)

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.sendmail(EMAIL_USER, to, msg.as_string())

        return True
    except Exception as e:
        print("❌ Email error:", e)
        return False


# ==============================
# 🚀 COMPANY ROUTES
# ==============================
@app.route("/api/register", methods=["POST"])
def register_company():
    data = request.json
    companyName = data.get("companyName")
    email = data.get("email")
    companyId = data.get("companyId")
    password = data.get("password")

    if not all([companyName, email, companyId, password]):
        return jsonify({"error": "All fields are required"}), 400

    try:
        cursor.execute(
            "INSERT INTO companies (company_name, email, company_id, password) VALUES (%s, %s, %s, %s)",
            (companyName, email, companyId, password),
        )
        db.commit()
        return jsonify({"message": "✅ Company registered successfully!", "companyId": companyId})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/login", methods=["POST"])
def company_login():
    data = request.json
    cid = data.get("id")
    password = data.get("password")

    if not cid or not password:
        return jsonify({"error": "ID and Password required"}), 400

    cursor.execute("SELECT * FROM companies WHERE company_id=%s OR email=%s", (cid, cid))
    company = cursor.fetchone()

    if not company or password != company["password"]:
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"message": "✅ Login successful!", "company": company})


# ==============================
# 🚀 EMPLOYEE ROUTES
# ==============================
@app.route("/api/employees", methods=["POST"])
def add_employee():
    data = request.json
    employee_id = data.get("employee_id")
    email = data.get("email")
    password = data.get("password")
    company_id = data.get("company_id")

    if not all([employee_id, email, password, company_id]):
        return jsonify({"error": "All fields required"}), 400

    cursor.execute("SELECT * FROM companies WHERE company_id=%s", (company_id,))
    if not cursor.fetchone():
        return jsonify({"error": "❌ Invalid Company ID"}), 400

    try:
        cursor.execute(
            "INSERT INTO employees (employee_id, email, password, company_id, created_at) VALUES (%s, %s, %s, %s, NOW())",
            (employee_id, email, password, company_id),
        )
        db.commit()
        return jsonify({"message": "✅ Employee added successfully!", "employeeId": employee_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/employees", methods=["GET"])
def get_employees():
    cursor.execute("SELECT employee_id, email, company_id, password, created_at, password_changed_at FROM employees")
    employees = cursor.fetchall()

    # Convert datetime fields to string
    for emp in employees:
        if emp.get("created_at"):
            emp["created_at"] = emp["created_at"].strftime("%Y-%m-%d %H:%M:%S")
        else:
            emp["created_at"] = "N/A"

        if emp.get("password_changed_at"):
            emp["password_changed_at"] = emp["password_changed_at"].strftime("%Y-%m-%d %H:%M:%S")
        else:
            emp["password_changed_at"] = "N/A"

    return jsonify(employees)


# ✅ NEW: Check Employee ID uniqueness
@app.route("/api/employees/check/<string:employee_id>", methods=["GET"])
def check_employee_id(employee_id):
    cursor.execute("SELECT employee_id FROM employees WHERE employee_id=%s", (employee_id,))
    exists = cursor.fetchone()
    return jsonify({"exists": bool(exists)})


@app.route("/api/employees/login", methods=["POST"])
def employee_login():
    data = request.json
    identifier = data.get("identifier")
    password = data.get("password")

    if not identifier or not password:
        return jsonify({"error": "Employee ID or Email and Password required"}), 400

    cursor.execute("SELECT * FROM employees WHERE employee_id=%s OR email=%s", (identifier, identifier))
    employee = cursor.fetchone()

    if not employee or password != employee["password"]:
        return jsonify({"error": "Invalid credentials"}), 401

    employee.pop("password", None)
    employee.pop("otp", None)
    employee.pop("otp_expiry", None)

    # Convert datetime fields
    if employee.get("created_at"):
        employee["created_at"] = employee["created_at"].strftime("%Y-%m-%d %H:%M:%S")
    else:
        employee["created_at"] = "N/A"
    if employee.get("password_changed_at"):
        employee["password_changed_at"] = employee["password_changed_at"].strftime("%Y-%m-%d %H:%M:%S")
    else:
        employee["password_changed_at"] = "N/A"

    return jsonify({"message": "✅ Employee login successful!", "employee": employee})


# ==============================
# 🚀 EMPLOYEE PASSWORD RESET
# ==============================
@app.route("/api/employees/forgot-password", methods=["POST"])
def employee_forgot_password():
    data = request.json
    identifier = data.get("identifier")

    cursor.execute("SELECT email, employee_id FROM employees WHERE employee_id=%s OR email=%s", (identifier, identifier))
    employee = cursor.fetchone()

    if not employee:
        return jsonify({"error": "Employee not found"}), 404

    otp = random.randint(100000, 999999)
    otp_expiry = datetime.now() + timedelta(minutes=1)

    cursor.execute("UPDATE employees SET otp=%s, otp_expiry=%s WHERE employee_id=%s",
                   (otp, otp_expiry, employee["employee_id"]))
    db.commit()

    send_email(
        employee["email"],
        "OTP for Password Reset",
        f"Your OTP for password reset is {otp}. It is valid for 1 minute.",
    )

    return jsonify({"message": f"✅ OTP sent to Employee: {employee['employee_id']}"})


@app.route("/api/employees/reset-password", methods=["POST"])
def employee_reset_password():
    data = request.json
    identifier = data.get("identifier")
    otp = data.get("otp")
    newPassword = data.get("newPassword")

    cursor.execute("SELECT * FROM employees WHERE employee_id=%s OR email=%s", (identifier, identifier))
    employee = cursor.fetchone()

    if not employee:
        return jsonify({"error": "Employee not found"}), 404

    if str(employee.get("otp")) != str(otp):
        return jsonify({"error": "Invalid OTP"}), 400

    if not employee.get("otp_expiry") or datetime.now() > employee["otp_expiry"]:
        return jsonify({"error": "OTP expired"}), 400

    # Update password and password_changed_at
    password_changed_at = datetime.now()
    cursor.execute("UPDATE employees SET password=%s, otp=NULL, otp_expiry=NULL, password_changed_at=%s WHERE employee_id=%s",
                   (newPassword, password_changed_at, employee["employee_id"]))
    db.commit()

    return jsonify({"message": "✅ Password updated successfully!"})


# ==============================
# 🚀 EMPLOYEE CREDENTIALS SHARE
# ==============================
@app.route("/api/employees/share", methods=["POST"])
def share_employee_credentials():
    data = request.json
    employee_id = data.get("employee_id")
    email = data.get("email")
    password = data.get("password")

    if not all([employee_id, email, password]):
        return jsonify({"error": "Employee ID, Email and Password required"}), 400

    html = f"""
    <div>
        <h2>Welcome to Innovascape 🎉</h2>
        <p>Here are your login credentials:</p>
        <ul>
          <li><b>Employee ID:</b> {employee_id}</li>
          <li><b>Email:</b> {email}</li>
          <li><b>Password:</b> {password}</li>
        </ul>
        <p>⚠️ Keep these credentials safe.</p>
    </div>
    """

    send_email(email, "Your Employee Credentials", f"Employee ID: {employee_id}\nEmail: {email}\nPassword: {password}", html)
    return jsonify({"message": f"✅ Credentials sent to {email}"})


# ==============================
# 🚀 MANAGER PASSWORD RESET
# ==============================
@app.route("/api/manager/forgot-password", methods=["POST"])
def manager_forgot_password():
    data = request.json
    identifier = data.get("identifier")

    cursor.execute("SELECT company_id, email FROM companies WHERE company_id=%s OR email=%s", (identifier, identifier))
    company = cursor.fetchone()

    if not company:
        return jsonify({"error": "Company not found"}), 404

    otp = random.randint(100000, 999999)
    otp_expiry = datetime.now() + timedelta(minutes=1)

    cursor.execute("UPDATE companies SET otp=%s, otp_expiry=%s WHERE company_id=%s", (otp, otp_expiry, company["company_id"]))
    db.commit()

    send_email(company["email"], "OTP for Password Reset", f"Your OTP is {otp}. Valid for 1 minute.")
    return jsonify({"message": f"✅ OTP sent to Company ID: {company['company_id']}"})


@app.route("/api/manager/reset-password", methods=["POST"])
def manager_reset_password():
    data = request.json
    identifier = data.get("identifier")
    otp = data.get("otp")
    newPassword = data.get("newPassword")

    cursor.execute("SELECT * FROM companies WHERE company_id=%s OR email=%s", (identifier, identifier))
    company = cursor.fetchone()

    if not company:
        return jsonify({"error": "Company not found"}), 404

    if str(company.get("otp")) != str(otp):
        return jsonify({"error": "Invalid OTP"}), 400

    if not company.get("otp_expiry") or datetime.now() > company["otp_expiry"]:
        return jsonify({"error": "OTP expired"}), 400

    cursor.execute("UPDATE companies SET password=%s, otp=NULL, otp_expiry=NULL WHERE company_id=%s",
                   (newPassword, company["company_id"]))
    db.commit()

    return jsonify({"message": "✅ Password updated successfully!"})


# ==============================
# 🚀 START SERVER
# ==============================
if __name__ == "__main__":
    app.run(port=5000, debug=True)
