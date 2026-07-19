const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.get('/:userId', requireAuth, async (req, res) => {
  const { userId } = req.params;
  
  if (req.user.id !== parseInt(userId, 10)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const result = await db.query(
      `SELECT m.id, m.title, m.description, m.target_value as "targetValue", m.coin_reward as "coinReward", 
              COALESCE(um.progress, 0) as progress, um.completed_at as "completedAt"
       FROM milestones m
       LEFT JOIN user_milestones um ON m.id = um.milestone_id AND um.user_id = $1`,
      [userId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
