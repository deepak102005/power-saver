const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const { period = 'week' } = req.query;
  
  try {
    // Check cache
    const cacheResult = await db.query('SELECT entries FROM leaderboard_cache WHERE period = $1', [period]);
    
    if (cacheResult.rows.length > 0) {
      return res.json(cacheResult.rows[0].entries);
    }
    
    // Fallback if not cached (in reality, a cron job updates the cache)
    const result = await db.query(
      'SELECT id as "userId", name, dorm, coins, current_streak as streak FROM users ORDER BY coins DESC LIMIT 100'
    );
    
    // Assign rank
    const entries = result.rows.map((row, index) => ({
      ...row,
      rank: index + 1
    }));
    
    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
