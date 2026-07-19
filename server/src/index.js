const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const usageRoutes = require('./routes/usage');
const leaderboardRoutes = require('./routes/leaderboard');
const milestonesRoutes = require('./routes/milestones');
const recommendationsRoutes = require('./routes/recommendations');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/milestones', milestonesRoutes);
app.use('/api/recommendations', recommendationsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
