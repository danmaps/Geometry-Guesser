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
app.post('/api/openai', async (req, res) => {
    const { prompt } = req.body;

    const apiKey = process.env.OPENAI_API_KEY; // Get the API key from your environment variables

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
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: prompt }  // The user's input as the prompt
                ],
                max_tokens: 1024,
                temperature: 0.5,
            }),
            verify_ssl: false
        });
    
        const data = await response.json();
        res.json(data);  // This sends the response back in the backend context
    } catch (error) {
        console.error('Error fetching from OpenAI:', error);
        res.status(500).json({ error: 'Failed to connect to OpenAI' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
