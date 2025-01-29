import express from "express";
import axios from "axios";

const app = express();

const CLARIFAI_API_KEY = "7eb37963c0644a6f868d69789ad62b58"; // Replace with your API key
const CLARIFAI_API_URL = "https://api.clarifai.com/v2/models/general-image-recognition/outputs";

app.get("/classify", async (req, res) => {
  const imageUrl = req.query.url;

  if (!imageUrl) {
    return res.status(400).json({ error: "Image URL is required" });
  }

  try {
    const response = await axios.post(
      CLARIFAI_API_URL,
      {
        inputs: [{ data: { image: { url: imageUrl } } }],
      },
      {
        headers: {
          Authorization: `Key ${CLARIFAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const predictions = response.data.outputs[0].data.concepts;
    res.json(predictions);
  } catch (error) {
    console.error("Error classifying image:", error);
    res.status(500).json({ error: "Error classifying image" });
  }
});

export const handler = app;