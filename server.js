require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const port = 3000;

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

function cleanAndParseJSON(str) {
    try {
        // First try direct parsing
        return JSON.parse(str);
    } catch (e) {
        // If direct parsing fails, try cleaning the string
        try {
            // Remove any markdown code block indicators and surrounding whitespace
            let cleaned = str.replace(/^[\s\S]*?{/, '{')  // Remove everything before first {
                           .replace(/}[\s\S]*$/, '}')     // Remove everything after last }
                           .trim();
            
            return JSON.parse(cleaned);
        } catch (e) {
            throw new Error('Failed to parse JSON response');
        }
    }
}

app.post('/process-meeting', async (req, res) => {
    try {
        const { meetingText } = req.body;
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a meeting summarizer. You must respond with ONLY a valid JSON object. No text before or after. No delimiters. No markdown. Just pure JSON data."
                },
                {
                    role: "user",
                    content: `Analyze this meeting text and respond with ONLY this exact JSON structure. No text before or after. No delimiters or quotes around the JSON. Just the pure JSON object:
{
    "summary": "brief overview",
    "decisions": ["list", "of", "decisions"],
    "actionItems": [
        {
            "task": "task description",
            "owner": "owner name",
            "due": "due date (if mentioned)"
        }
    ]
}

Meeting text: ${meetingText}`
                }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        const result = completion.choices[0].message.content;
        const parsedJson = cleanAndParseJSON(result);
        
        // Validate the JSON structure
        if (!parsedJson.summary || !Array.isArray(parsedJson.decisions) || !Array.isArray(parsedJson.actionItems)) {
            throw new Error('Invalid response format from AI');
        }

        res.json(parsedJson);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Failed to process meeting text',
            details: error.message,
            rawResponse: error.rawResponse || null
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 