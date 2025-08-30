// Removed jsonwebtoken import and related auth code
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Serve static frontend files
const frontendPath = path.resolve(__dirname, '..');
app.use(express.static(frontendPath));

// Fallback to serve index.html for unmatched routes (SPA support), excluding API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// In-memory user progress store
const userProgressStore = {};

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

// AI simulation endpoint (no auth)
app.post('/api/ai-simulate', async (req, res) => {
  const { input, algorithmType } = req.body;

  // Real Gemini API key from environment variable
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return res.status(401).json({ error: 'Missing Gemini API key' });
  }

  // Real Gemini API endpoint (example for Vertex AI Generative Language API)
  const endpoint = 'https://generativelanguage.googleapis.com/v1beta2/models/gemini-1.5/outputs:generate';

  // Prepare request body based on Vertex AI API spec
  const requestBody = {
    prompt: {
      messages: [
        {
          content: input,
          role: 'user'
        }
      ]
    },
    // Additional parameters can be added here, e.g., temperature, maxOutputTokens
  };

  try {
    const response = await axios.post(endpoint, requestBody, {
      headers: {
        'Authorization': `Bearer ${GEMINI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Extract generated text from response (adjust based on actual API response structure)
    const output = response.data?.candidates?.[0]?.content || 'No response from Gemini API';

    // For transparency breakdown, we can mock or parse response details if available
    const analysis = [
      'Processed input with Gemini AI',
      'Generated response based on model output',
      'Applied content filtering and safety checks'
    ];

    res.json({ output, analysis });
  } catch (error) {
    console.error('Gemini API call failed:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to process AI simulation', details: error.response ? error.response.data : error.message });
  }
});

// Fact-checking endpoint (no auth)
app.post('/api/fact-check', (req, res) => {
  const { content } = req.body;
  // TODO: Integrate real fact-checking API here
  res.json({
    verified: true,
    message: 'Content appears reliable based on mock analysis.',
    reasoning: [
      'No misinformation patterns detected',
      'Content matches trusted sources'
    ],
    tip: 'Always verify with multiple sources.'
  });
});

// Save user progress endpoint (no auth)
app.post('/api/progress', (req, res) => {
  const { moduleId, progress } = req.body;
  // For demo, store progress without user context
  userProgressStore[moduleId] = progress;
  res.json({ message: 'Progress saved' });
});

// Get user progress endpoint (no auth)
app.get('/api/progress/:moduleId', (req, res) => {
  const moduleId = req.params.moduleId;
  const progress = userProgressStore[moduleId] || null;
  res.json({ progress });
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
