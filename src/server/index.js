// server.js
const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs"); // For password hashing

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
// ⚠️ Fix database table if needed
// ==============================
// Run these once in MySQL if not already done:
// ALTER TABLE companies CHANGE cornpany_id company_id VARCHAR(255);
// ALTER TABLE companies ADD COLUMN otp VARCHAR(10);
// ALTER TABLE companies ADD COLUMN otp_expiry DATETIME;

// ==============================
// 🚀 EMAIL TRANSPORTER
// ==============================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aribali1804@gmail.com",
    pass: "xpfp szcf fcjl grsw", // ⚠️ move to .env in production
  },
});

// ==============================
// 🚀 COMPANY ROUTES
// ==============================
app.post("/api/register", async (req, res) => {
  const { companyName, email, companyId, password } = req.body;
  if (!companyName || !email || !companyId || !password)
    return res.status(400).json({ error: "All fields are required" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const sql =
    "INSERT INTO companies (company_name, email, company_id, password) VALUES (?, ?, ?, ?)";
  db.query(sql, [companyName, email, companyId, hashedPassword], (err, result) => {
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
  db.query(sql, [id, id], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error: " + err.message });
    if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const company = results[0];
    const match = await bcrypt.compare(password, company.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ message: "✅ Login successful!", company });
  });
});

// ==============================
// 🚀 EMPLOYEE ROUTES
// ==============================
app.post("/api/employees", async (req, res) => {
  const { employee_id, email, password } = req.body;
  if (!employee_id || !email || !password) {
    return res.status(400).json({ error: "Employee ID, Email, and Password required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = "INSERT INTO employees (employee_id, email, password) VALUES (?, ?, ?)";
  db.query(sql, [employee_id, email, hashedPassword], (err) => {
    if (err) {
      console.error("❌ Error adding employee:", err);
      return res.status(500).json({ error: "Database error: " + err.message });
    }
    res.json({ message: "✅ Employee added successfully!", employeeId: employee_id });
  });
});

app.get("/api/employees", (req, res) => {
  const sql =
    "SELECT employee_id, email, password, created_at FROM employees ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error: " + err.message });
    res.json(results);
  });
});

app.post("/api/employees/login", (req, res) => {
  const { employee_id, email, password } = req.body;
  if ((!employee_id && !email) || !password)
    return res.status(400).json({ error: "Employee ID or Email and Password required" });

  const sql = employee_id
    ? "SELECT * FROM employees WHERE employee_id=?"
    : "SELECT * FROM employees WHERE email=?";
  const params = employee_id ? [employee_id] : [email];

  db.query(sql, params, async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error: " + err.message });
    if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const employee = results[0];
    const match = await bcrypt.compare(password, employee.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const { password: _, otp, otp_expiry, ...empData } = employee;
    res.json({ message: "✅ Employee login successful!", employee: empData });
  });
});

// ==============================
// 🚀 EMPLOYEE PASSWORD RESET WITH OTP
// ==============================
app.post("/api/employees/forgot-password", (req, res) => {
  const { employee_id } = req.body;
  if (!employee_id) return res.status(400).json({ error: "Employee ID required" });

  db.query("SELECT email FROM employees WHERE employee_id=?", [employee_id], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error: " + err.message });
    if (results.length === 0) return res.status(404).json({ error: "Employee not found" });

    const employeeEmail = results[0].email;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date(Date.now() + 1 * 60 * 1000); // 1 minute

    db.query(
      "UPDATE employees SET otp=?, otp_expiry=? WHERE employee_id=?",
      [otp, otpExpiry, employee_id],
      async (err2) => {
        if (err2) return res.status(500).json({ error: "Database error: " + err2.message });

        try {
          await transporter.sendMail({
            from: "aribali1804@gmail.com",
            to: employeeEmail,
            subject: "OTP for Password Reset",
            text: `Your OTP for password reset is ${otp}. It is valid for 1 minute.`,
          });
          res.json({ message: `✅ OTP sent to Employee ID: ${employee_id}` });
        } catch (e) {
          console.error(e);
          res.status(500).json({ error: "Failed to send OTP" });
        }
      }
    );
  });
});

app.post("/api/employees/reset-password", async (req, res) => {
  const { employee_id, otp, newPassword } = req.body;
  if (!employee_id || !otp || !newPassword)
    return res.status(400).json({ error: "All fields are required" });

  db.query(
    "SELECT otp, otp_expiry FROM employees WHERE employee_id=?",
    [employee_id],
    async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error: " + err.message });
      if (results.length === 0) return res.status(404).json({ error: "Employee not found" });

      const { otp: dbOtp, otp_expiry } = results[0];
      if (String(dbOtp) !== String(otp)) return res.status(400).json({ error: "Invalid OTP" });
      if (!otp_expiry || new Date() > new Date(otp_expiry))
        return res.status(400).json({ error: "OTP expired" });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      db.query(
        "UPDATE employees SET password=?, otp=NULL, otp_expiry=NULL WHERE employee_id=?",
        [hashedPassword, employee_id],
        (err2) => {
          if (err2) return res.status(500).json({ error: "Database error: " + err2.message });
          res.json({ message: "✅ Password updated successfully!" });
        }
      );
    }
  );
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
  const { companyId } = req.body;
  if (!companyId) return res.status(400).json({ error: "Company ID required" });

  db.query("SELECT email FROM companies WHERE company_id=?", [companyId], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error: " + err.message });
    if (results.length === 0) return res.status(404).json({ error: "Company not found" });

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

app.post("/api/manager/reset-password", async (req, res) => {
  const { companyId, otp, newPassword } = req.body;
  if (!companyId || !otp || !newPassword)
    return res.status(400).json({ error: "All fields are required" });

  db.query(
    "SELECT otp, otp_expiry FROM companies WHERE company_id=?",
    [companyId],
    async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error: " + err.message });
      if (results.length === 0) return res.status(404).json({ error: "Company not found" });

      const { otp: dbOtp, otp_expiry } = results[0];

      if (String(dbOtp) !== String(otp)) return res.status(400).json({ error: "Invalid OTP" });
      if (!otp_expiry || new Date() > new Date(otp_expiry))
        return res.status(400).json({ error: "OTP expired" });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      db.query(
        "UPDATE companies SET password=?, otp=NULL, otp_expiry=NULL WHERE company_id=?",
        [hashedPassword, companyId],
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
