const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",          // or appuser
  password: "areeb@123", // your MySQL password
  database: "innovascape"
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
  } else {
    console.log("✅ MySQL connected successfully!");
  }
});

// ✅ Register API
app.post("/api/register", (req, res) => {
  const { companyName, email, companyId, password } = req.body;

  if (!companyName || !email || !companyId || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql =
    "INSERT INTO companies (company_name, email, company_id, password) VALUES (?, ?, ?, ?)";
  db.query(sql, [companyName, email, companyId, password], (err, result) => {
    if (err) {
      console.error("❌ Error inserting company:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({
      message: "✅ Company registered successfully!",
      companyId: result.insertId,
    });
  });
});

// ✅ Login API
app.post("/api/login", (req, res) => {
  const { id, password } = req.body; // id = companyId OR email

  if (!id || !password) {
    return res.status(400).json({ error: "ID and Password required" });
  }

  // check with company_id OR email
  const sql =
    "SELECT * FROM companies WHERE (company_id = ? OR email = ?) AND password = ?";

  db.query(sql, [id, id, password], (err, results) => {
    if (err) {
      console.error("❌ Error during login:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length > 0) {
      res.json({
        message: "✅ Login successful!",
        company: results[0], // return company details
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });
});

// ✅ Start Server
app.listen(5000, () =>
  console.log("🚀 Server running at http://localhost:5000")
);
