//require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: 'postgresql://postgres_w3c0_user:0Lkhu0xrTTIZlpJIATV5HiWNugMGu2SZ@dpg-d3e11hnfte5s73f3ep60-a/postgres_w3c0',
  ssl: {
    rejectUnauthorized: false, // Required by Render PostgreSQL
  },
});

app.use(express.json());

// Test Route
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(`Connected to Postgres DB. Time: ${result.rows[0].now}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database connection error');
  }
});

// Insert route
/*app.post("/api/insert", async (req, res) => {
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
});*/

// Insert route - saves form responses into Postgres
app.post("/api/insert", async (req, res) => {
  try {
    // Destructure input from request body
    const { name, email } = req.body;
console.log("Name = ", name, "Email = ", email);
    // Validate input
    if (!name || !email) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields: name and email"
      });
    }

    // Insert into form_responses table
    const result = await pool.query(
      "INSERT INTO form_responses (name, email) VALUES ($1, $2) RETURNING id, name, email",
      [name, email]
    );

    // Send back success response
    res.status(201).json({
      status: "success",
      data: result.rows[0]
    });

  } catch (err) {
    console.error("DB Insert Error:", err);

    // Send error response
    res.status(500).json({
      status: "error",
      message: "Database insert failed",
      details: err.message
    });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

/*
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

//await pool.connect();
//console.log("Connected to the database");


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
*/







