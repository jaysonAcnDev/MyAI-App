const axios = require('axios');

const CLARIFAI_API_KEY = '7eb37963c0644a6f868d69789ad62b58';
const CLARIFAI_API_URL = 'https://api.clarifai.com/v2/models/general-image-recognition/outputs';

exports.handler = async (event) => {
  const imageUrl = event.queryStringParameters?.url;

  if (!imageUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Image URL is required' }),
    };
  }

  try {
    const response = await axios.post(
      CLARIFAI_API_URL,
      { inputs: [{ data: { image: { url: imageUrl } } }] },
      {
        headers: {
          Authorization: `Key ${CLARIFAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const predictions = response.data.outputs?.[0]?.data?.concepts || [];

    return {
      statusCode: 200,
      body: JSON.stringify(predictions),
    };
  } catch (error) {
    console.error('Error classifying image:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error classifying image' }),
    };
  }
};