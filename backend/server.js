// Removed jsonwebtoken import and related auth code
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

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
app.post('/api/ai-simulate', (req, res) => {
  const { input, algorithmType } = req.body;
  // TODO: Integrate real AI API here
  res.json({
    output: `Simulated AI output for input: "${input}" using algorithm: "${algorithmType}"`,
    analysis: [
      'Step 1: Input processed',
      'Step 2: Algorithm applied',
      'Step 3: Output generated'
    ]
  });
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
