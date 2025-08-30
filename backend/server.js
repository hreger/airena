// Required modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Serve static frontend files
const path = require('path');
const frontendPath = path.resolve(__dirname, '..');
app.use(express.static(frontendPath));

// Fallback to serve index.html for unmatched routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// In-memory user store and progress store
const users = [];
const userProgressStore = {};

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

// User registration endpoint
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  users.push({ username, password });
  res.json({ message: 'User registered successfully' });
});

// User login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const accessToken = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ accessToken });
});

// Protected AI simulation endpoint
app.post('/api/ai-simulate', authenticateToken, (req, res) => {
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

// Protected fact-checking endpoint
app.post('/api/fact-check', authenticateToken, (req, res) => {
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

// Save user progress endpoint
app.post('/api/progress', authenticateToken, (req, res) => {
  const username = req.user.username;
  const { moduleId, progress } = req.body;
  if (!userProgressStore[username]) {
    userProgressStore[username] = {};
  }
  userProgressStore[username][moduleId] = progress;
  res.json({ message: 'Progress saved' });
});

// Get user progress endpoint
app.get('/api/progress/:moduleId', authenticateToken, (req, res) => {
  const username = req.user.username;
  const moduleId = req.params.moduleId;
  const progress = userProgressStore[username] ? userProgressStore[username][moduleId] : null;
  res.json({ progress });
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
