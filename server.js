// Import required packages
import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Serve static files (styles and HTML)
app.use(express.static(path.join(__dirname, 'public')));

// Clarifai API setup
const CLARIFAI_API_KEY = '7eb37963c0644a6f868d69789ad62b58'; // Replace with your API key
const CLARIFAI_API_URL = 'https://api.clarifai.com/v2/models/general-image-recognition/outputs';

// Endpoint to classify image by URL
app.get('/classify', async (req, res) => {
  const imageUrl = req.query.url;

  if (!imageUrl) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  try {
    const response = await axios.post(
      CLARIFAI_API_URL,
      {
        inputs: [{ data: { image: { url: imageUrl } } }]
      },
      {
        headers: {
          Authorization: `Key ${CLARIFAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const predictions = response.data.outputs[0].data.concepts;

    // Respond with the classification result
    res.json(predictions);
  } catch (error) {
    console.error('Error classifying image:', error);
    res.status(500).json({ error: 'Error classifying image' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});