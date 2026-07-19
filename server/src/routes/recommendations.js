const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/auth');
const aiService = require('../services/aiService');

const router = express.Router();

// Get recent recommendations for user
router.get('/:userId', requireAuth, async (req, res) => {
  const { userId } = req.params;
  
  if (req.user.id !== parseInt(userId, 10)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const result = await db.query(
      'SELECT * FROM recommendations WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Generate new recommendations
router.post('/generate', requireAuth, async (req, res) => {
  const userId = req.user.id;
  
  try {
    let usageRows = [];
    let dorm = 'college dorm';
    
    try {
      // Get last 7 days of usage
      const usageResult = await db.query(
        "SELECT kwh, timestamp FROM usage_readings WHERE user_id = $1 AND timestamp >= NOW() - INTERVAL '7 days' ORDER BY timestamp ASC",
        [userId]
      );
      usageRows = usageResult.rows;
      
      const userResult = await db.query('SELECT dorm FROM users WHERE id = $1', [userId]);
      dorm = userResult.rows[0]?.dorm || 'college dorm';
    } catch (dbErr) {
      console.warn("Database query failed, using fallback data for AI", dbErr.message);
      // Mock usage data for AI context if DB is not connected
      usageRows = [
        { kwh: 1.5, timestamp: new Date() },
        { kwh: 2.1, timestamp: new Date(Date.now() - 86400000) }
      ];
    }
    
    // Call AI Service
    const tips = await aiService.generateTips(usageRows, dorm);
    
    // Save to DB
    try {
      for (const tip of tips) {
        await db.query(
          'INSERT INTO recommendations (user_id, text, estimated_savings_kwh) VALUES ($1, $2, $3)',
          [userId, tip.text, tip.estimatedSavingsKwh]
        );
      }
    } catch (dbErr) {
      console.warn("Could not save to DB, skipping.", dbErr.message);
    }
    
    res.json({ success: true, tips });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error generating tips' });
  }
});

// Chat with AI
router.post('/chat', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  try {
    let usageRows = [];
    let dorm = 'college dorm';
    
    try {
      const usageResult = await db.query(
        "SELECT kwh, timestamp FROM usage_readings WHERE user_id = $1 AND timestamp >= NOW() - INTERVAL '7 days' ORDER BY timestamp ASC",
        [userId]
      );
      usageRows = usageResult.rows;
      
      const userResult = await db.query('SELECT dorm FROM users WHERE id = $1', [userId]);
      dorm = userResult.rows[0]?.dorm || 'college dorm';
    } catch (dbErr) {
      console.warn("Database query failed for chat context");
    }
    
    const aiResponse = await aiService.chatWithAI(message, usageRows, dorm);
    res.json({ success: true, response: aiResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during chat' });
  }
});

module.exports = router;
