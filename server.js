const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();
app.use(bodyParser.json());

// MongoDB connection
const mongoUrl = "mongodb://localhost:27017";
const dbName = "formsDB";

app.post("/api/form", async (req, res) => {
  try {
    const data = req.body;
    console.log("Received:", data);

    const client = new MongoClient(mongoUrl);
    await client.connect();
    const db = client.db(dbName);

    await db.collection("responses").insertOne(data);

    await client.close();

    res.status(200).send("Saved successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving response");
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
