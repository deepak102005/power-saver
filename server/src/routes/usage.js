const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// Get usage data for a user with optional range (24h or 7d)
router.get('/:userId', requireAuth, async (req, res) => {
  const { userId } = req.params;
  const { range } = req.query; // '24h' or '7d'
  
  if (req.user.id !== parseInt(userId, 10)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  let timeFilter = "NOW() - INTERVAL '7 days'";
  if (range === '24h') {
    timeFilter = "NOW() - INTERVAL '24 hours'";
  }

  try {
    const result = await db.query(
      `SELECT kwh, timestamp FROM usage_readings WHERE user_id = $1 AND timestamp >= ${timeFilter} ORDER BY timestamp ASC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Ingest new usage reading
router.post('/ingest', requireAuth, async (req, res) => {
  const { kwh, timestamp } = req.body;
  const userId = req.user.id;

  try {
    const ts = timestamp ? new Date(timestamp) : new Date();
    
    await db.query(
      'INSERT INTO usage_readings (user_id, kwh, timestamp) VALUES ($1, $2, $3)',
      [userId, kwh, ts]
    );
    
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
