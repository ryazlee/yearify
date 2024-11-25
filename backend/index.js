const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors()); // Allow requests from all origins
app.use(express.json()); // Parse incoming JSON requests

// Route for fetching place details
app.get("/places", async (req, res) => {
  const query = req.query.query; // Get the 'query' parameter from the URL

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
    query
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    res.json(response.data); // Send the API response back to the frontend
  } catch (error) {
    console.error("Error fetching places:", error.message);
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

