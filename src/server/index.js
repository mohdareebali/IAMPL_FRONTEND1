const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// ==============================
// ✅ MySQL Connection
// ==============================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "areeb@123",
  database: "innovascape",
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
  } else {
    console.log("✅ MySQL connected successfully!");
  }
});

// ==============================
// 🚀 EMAIL TRANSPORTER
// ==============================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aribali1804@gmail.com",
    pass: "xpfp szcf fcjl grsw",
  },
});

// ==============================
// 🚀 COMPANY ROUTES
// ==============================
app.post("/api/register", (req, res) => {
  const { companyName, email, companyId, password } = req.body;
  if (!companyName || !email || !companyId || !password)
    return res.status(400).json({ error: "All fields are required" });

  const sql =
    "INSERT INTO companies (company_name, email, company_id, password) VALUES (?, ?, ?, ?)";
  db.query(sql, [companyName, email, companyId, password], (err, result) => {
    if (err) {
      console.error("❌ Error inserting company:", err);
      return res.status(500).json({ error: "Database error: " + err.message });
    }
    res.json({ message: "✅ Company registered successfully!", companyId: result.insertId });
  });
});

app.post("/api/login", (req, res) => {
  const { id, password } = req.body;
  if (!id || !password) return res.status(400).json({ error: "ID and Password required" });

  const sql = "SELECT * FROM companies WHERE company_id=? OR email=?";
  db.query(sql, [id, id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error: " + err.message });
    if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const company = results[0];
    if (password !== company.password) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ message: "✅ Login successful!", company });
  });
});

// ==============================
// 🚀 EMPLOYEE ROUTES
// ==============================
app.post("/api/employees", (req, res) => {
  const { employee_id, email, password, company_id } = req.body;
  if (!employee_id || !email || !password || !company_id)
    return res.status(400).json({ error: "Employee ID, Email, Password, and Company ID required" });

  // check company exists
  db.query("SELECT * FROM companies WHERE company_id=?", [company_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error: " + err.message });
    if (results.length === 0) return res.status(400).json({ error: "❌ Invalid Company ID" });

    const sql =
      "INSERT INTO employees (employee_id, email, password, company_id, created_at) VALUES (?, ?, ?, ?, NOW())";
    db.query(sql, [employee_id, email, password, company_id], (err2) => {
      if (err2) return res.status(500).json({ error: "Database error: " + err2.message });
      res.json({ message: "✅ Employee added successfully!", employeeId: employee_id });
    });
  });
});

// ==============================
// ✅ GET ALL EMPLOYEES (FOR EMPLOYEE INFO SCREEN)
// ==============================
app.get("/api/employees", (req, res) => {
  const sql = "SELECT employee_id, email, company_id, password, created_at, password_changed_at FROM employees";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error: " + err.message });
    res.json(results);
  });
});

// ==============================
// 🚀 EMPLOYEE LOGIN (ID or Email)
// ==============================
app.post("/api/employees/login", (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password)
    return res.status(400).json({ error: "Employee ID or Email and Password required" });

  const sql = "SELECT * FROM employees WHERE employee_id=? OR email=?";
  db.query(sql, [identifier, identifier], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error: " + err.message });

    if (results.length === 0)
      return res.status(401).json({ error: "Invalid credentials" });

    const employee = results[0];

    if (password !== employee.password)
      return res.status(401).json({ error: "Invalid credentials" });

    const { password: _, otp, otp_expiry, ...empData } = employee;

    res.json({ message: "✅ Employee login successful!", employee: empData });
  });
});

// ==============================
// 🚀 EMPLOYEE PASSWORD RESET WITH OTP
// ==============================
app.post("/api/employees/forgot-password", (req, res) => {
  const { identifier } = req.body;
  if (!identifier) return res.status(400).json({ error: "Employee ID or Email required" });

  const sql = "SELECT email, employee_id FROM employees WHERE employee_id=? OR email=?";
  db.query(sql, [identifier, identifier], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error: " + err.message });
    if (results.length === 0) return res.status(404).json({ error: "Employee not found" });

    const employeeEmail = results[0].email;
    const employeeId = results[0].employee_id;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date(Date.now() + 1 * 60 * 1000); // 1 minute

    db.query(
      "UPDATE employees SET otp=?, otp_expiry=? WHERE employee_id=?",
      [otp, otpExpiry, employeeId],
      async (err2) => {
        if (err2) return res.status(500).json({ error: "Database error: " + err2.message });

        try {
          await transporter.sendMail({
            from: "aribali1804@gmail.com",
            to: employeeEmail,
            subject: "OTP for Password Reset",
            text: `Your OTP for password reset is ${otp}. It is valid for 1 minute.`,
          });
          res.json({ message: `✅ OTP sent to Employee: ${employeeId}` });
        } catch (e) {
          console.error(e);
          res.status(500).json({ error: "Failed to send OTP" });
        }
      }
    );
  });
});

app.post("/api/employees/reset-password", (req, res) => {
  const { identifier, otp, newPassword } = req.body;
  if (!identifier || !otp || !newPassword)
    return res.status(400).json({ error: "All fields are required" });

  const sql = "SELECT employee_id, otp, otp_expiry FROM employees WHERE employee_id=? OR email=?";
  db.query(sql, [identifier, identifier], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error: " + err.message });
    if (results.length === 0) return res.status(404).json({ error: "Employee not found" });

    const { employee_id, otp: dbOtp, otp_expiry } = results[0];

    if (String(dbOtp) !== String(otp)) return res.status(400).json({ error: "Invalid OTP" });
    if (!otp_expiry || new Date() > new Date(otp_expiry))
      return res.status(400).json({ error: "OTP expired" });

    db.query(
      "UPDATE employees SET password=?, otp=NULL, otp_expiry=NULL, password_changed_at=NOW() WHERE employee_id=?",
      [newPassword, employee_id],
      (err2) => {
        if (err2) return res.status(500).json({ error: "Database error: " + err2.message });
        res.json({ message: "✅ Password updated successfully!" });
      }
    );
  });
});

// ==============================
// 🚀 SHARE EMPLOYEE CREDENTIALS
// ==============================
app.post("/api/employees/share", async (req, res) => {
  const { employee_id, email, password } = req.body;
  if (!employee_id || !email || !password) {
    return res.status(400).json({ error: "Employee ID, Email and Password required" });
  }

  try {
    await transporter.sendMail({
      from: "aribali1804@gmail.com",
      to: email,
      subject: "Your Employee Credentials",
      text: `Hello,\n\nEmployee ID: ${employee_id}\nEmail: ${email}\nPassword: ${password}`,
      html: `<div>
        <h2>Welcome to Innovascape 🎉</h2>
        <p>Here are your login credentials:</p>
        <ul>
          <li><b>Employee ID:</b> ${employee_id}</li>
          <li><b>Email:</b> ${email}</li>
          <li><b>Password:</b> ${password}</li>
        </ul>
        <p>⚠️ Keep these credentials safe.</p>
      </div>`,
    });
    res.json({ message: `✅ Credentials sent to ${email}` });
  } catch (err) {
    console.error("❌ Error sending credentials:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// ==============================
// 🚀 MANAGER PASSWORD RESET WITH OTP (1 min expiry)
// ==============================
app.post("/api/manager/forgot-password", (req, res) => {
  const { identifier } = req.body;
  if (!identifier) return res.status(400).json({ error: "Company ID or Email required" });

  db.query("SELECT company_id, email FROM companies WHERE company_id=? OR email=?", [identifier, identifier], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error: " + err.message });
    if (results.length === 0) return res.status(404).json({ error: "Company not found" });

    const companyId = results[0].company_id;
    const companyEmail = results[0].email;
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const otpExpiry = new Date(Date.now() + 1 * 60 * 1000); // 1 minute

    db.query(
      "UPDATE companies SET otp=?, otp_expiry=? WHERE company_id=?",
      [otp, otpExpiry, companyId],
      async (err2) => {
        if (err2) return res.status(500).json({ error: "Database error: " + err2.message });

        try {
          await transporter.sendMail({
            from: "aribali1804@gmail.com",
            to: companyEmail,
            subject: "OTP for Password Reset",
            text: `Your OTP for password reset is ${otp}. It is valid for 1 minute.`,
          });
          res.json({ message: `✅ OTP sent to Company ID: ${companyId}` });
        } catch (e) {
          console.error(e);
          res.status(500).json({ error: "Failed to send OTP" });
        }
      }
    );
  });
});

app.post("/api/manager/reset-password", (req, res) => {
  const { identifier, otp, newPassword } = req.body;
  if (!identifier || !otp || !newPassword)
    return res.status(400).json({ error: "All fields are required" });

  db.query(
    "SELECT company_id, otp, otp_expiry FROM companies WHERE company_id=? OR email=?",
    [identifier, identifier],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error: " + err.message });
      if (results.length === 0) return res.status(404).json({ error: "Company not found" });

      const { company_id, otp: dbOtp, otp_expiry } = results[0];

      if (String(dbOtp) !== String(otp)) return res.status(400).json({ error: "Invalid OTP" });
      if (!otp_expiry || new Date() > new Date(otp_expiry))
        return res.status(400).json({ error: "OTP expired" });

      db.query(
        "UPDATE companies SET password=?, otp=NULL, otp_expiry=NULL WHERE company_id=?",
        [newPassword, company_id],
        (err2) => {
          if (err2) return res.status(500).json({ error: "Database error: " + err2.message });
          res.json({ message: "✅ Password updated successfully!" });
        }
      );
    }
  );
});

// ==============================
// 🚀 START SERVER
// ==============================
app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});