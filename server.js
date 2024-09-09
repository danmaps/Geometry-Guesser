// Install Express: npm install express
const express = require('express');
const fetch = require('node-fetch');
const app = express();
require('dotenv').config(); // Use dotenv for environment variables

app.use(express.json());

app.post('/api/openai', async (req, res) => {
    const { prompt } = req.body;

    const apiKey = process.env.OPENAI_API_KEY; // Get the API key from your environment variables

    try {
        const response = await fetch('https://api.openai.com/v1/engines/text-davinci-002/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            },
            body: JSON.stringify({
                prompt: prompt,
                max_tokens: 1024,
                n: 1,
                stop: null,
                temperature: 0.5
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching from OpenAI:', error);
        res.status(500).json({ error: 'Failed to connect to OpenAI' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
