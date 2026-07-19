-- PostgreSQL Schema for PowerSaver AI

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS leaderboard_cache;
DROP TABLE IF EXISTS recommendations;
DROP TABLE IF EXISTS user_milestones;
DROP TABLE IF EXISTS milestones;
DROP TABLE IF EXISTS usage_readings;
DROP TABLE IF EXISTS users;

-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    dorm VARCHAR(255),
    coins INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Usage Readings Table
CREATE TABLE usage_readings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    kwh DECIMAL(10, 2) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_usage_readings_user_id ON usage_readings(user_id);
CREATE INDEX idx_usage_readings_timestamp ON usage_readings(timestamp);

-- 3. Milestones Table
CREATE TABLE milestones (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_type VARCHAR(50) NOT NULL, -- e.g., 'kwh_saved', 'streak_days'
    target_value INTEGER NOT NULL,
    coin_reward INTEGER NOT NULL
);

-- Insert some default milestones
INSERT INTO milestones (title, description, target_type, target_value, coin_reward) VALUES 
('First Step', 'Save your first 10 kWh', 'kwh_saved', 10, 50),
('Consistency is Key', 'Maintain a 7-day streak', 'streak_days', 7, 100),
('Eco Warrior', 'Save 50 kWh', 'kwh_saved', 50, 200);

-- 4. User Milestones Table
CREATE TABLE user_milestones (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    milestone_id INTEGER REFERENCES milestones(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, milestone_id)
);

-- 5. Recommendations Table (AI Tips)
CREATE TABLE recommendations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    estimated_savings_kwh DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'done', 'dismissed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Leaderboard Cache Table
CREATE TABLE leaderboard_cache (
    id SERIAL PRIMARY KEY,
    period VARCHAR(50) NOT NULL, -- 'week', 'month', 'all'
    entries JSONB NOT NULL, -- Array of objects: [{ userId, coins, streak, rank }]
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(period)
);
