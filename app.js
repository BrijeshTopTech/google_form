const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
app.use(bodyParser.json());

// PostgreSQL connection config
const pool = new Pool({
  user: "postgres",
  host: "localhost",   // or your remote server
  database: "google_forms",
  password: "admin",
  port: 5432,
});

// API endpoint
app.post("/api/insert", async (req, res) => {
  const { name, email } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO form_responses (name, email) VALUES ($1, $2) RETURNING id",
      [name, email]
    );

    res.status(201).json({ status: "success", id: result.rows[0].id });
  } catch (err) {
    console.error("Error inserting into DB:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

