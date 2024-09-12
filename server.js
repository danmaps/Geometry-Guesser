const express = require('express');
//const fetch = require('node-fetch');
// dynamic import
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const cors = require('cors'); // Import CORS
const app = express();
require('dotenv').config(); // Use dotenv for environment variables

app.use(express.json());

// Enable CORS for all routes (Allow requests from any origin)
app.use(cors());

// Define your POST route
app.post('/api/ai_geojson', async (req, res) => {
    const { prompt } = req.body;

    const apiKey = process.env.OPENAI_API_KEY; // Get the API key from your environment variables
    // console.log(apiKey)
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: "You are a helpful assistant that always only returns valid GeoJSON in response to user queries. Don't use too many vertices. Include somewhat detailed geometry and any attributes you think might be relevant. Include factual information. If you want to communicate text to the user, you may use a message property in the attributes of geometry objects. For compatibility with ArcGIS Pro, avoid multiple geometry types in the GeoJSON output. For example, don't mix points and polygons." },
                    { role: "user", content: prompt }  // The user's input as the prompt
                ],
                max_tokens: 1024,
                temperature: 0.5,
                response_format: { "type": "json_object" }
            }),
            // verify_ssl: false
        });
    
        const data = await response.json();
        console.log(data);
        try {
            const geoJSON = JSON.parse(data.choices[0].message.content);
            console.log(geoJSON);
            res.status(200).json(geoJSON);
          } catch (err) {
            console.error("Invalid GeoJSON response:", err);
          }
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching from OpenAI:', error);
        res.status(500).json({ error: 'Failed to connect to OpenAI' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
