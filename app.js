const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
app.use(bodyParser.json());

// Connect to Railway Postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // required on Railway
});

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",   // or your remote server
//   database: "google_forms",
//   password: "admin",
//   port: 5432,
// });

// Middleware: API key security
app.use((req, res, next) => {
  if (req.headers["x-api-key"] !== process.env.API_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
});

// Insert route
app.post("/api/insert", async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO form_responses (name, email) VALUES ($1, $2) RETURNING id",
      [name, email]
    );
    res.status(201).json({ status: "success", id: result.rows[0].id });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
