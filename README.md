# PowerSaver AI - Energy Saving Platform 🌍⚡

## ⚠️ Problem Statement
Energy consumption on college campuses and in student dormitories is often excessively high due to a lack of awareness, motivation, and direct accountability. Students often leave high-draw appliances plugged in, lights on, and temperature controls unoptimized because they don't directly see the financial or environmental impact of their daily habits. There is a need for a platform that not only tracks usage but proactively guides and incentivizes students to build sustainable habits.

## 💡 Solution
**PowerSaver** is a modern, AI-powered, and gamified web application built to solve campus energy waste. It provides:
1. **Live Energy Tracking:** A real-time dashboard visualizing daily and weekly power usage.
2. **AI Energy Assistant:** An intelligent Chatbot powered by Google Gemini (with a robust offline local fallback) that provides tailored, actionable recommendations on how to reduce energy waste based on user context.
3. **Gamification & Rewards:** Students earn points for logging readings, hitting reduction goals, and maintaining energy-saving streaks, which can be redeemed for campus coupons.
4. **Community Leaderboards:** A competitive ranking system to foster a sense of community responsibility.
5. **Impact Reporting:** Downloadable PDF reports highlighting carbon offset and trees saved.

## 🏗️ Architecture Diagram
Below is the high-level architecture diagram of the PowerSaver platform.

```mermaid
graph TD
    subgraph Frontend [Client - React + Vite]
        UI[User Interface - Tailwind CSS]
        Dash[Dashboard & Charts - Recharts]
        Chat[AI Assistant UI]
        Redeem[Rewards System]
    end

    subgraph Backend [Server - Node.js + Express]
        API[Express REST API]
        Auth[JWT Authentication]
        AI_Service[AI Integration Service]
        Fallback[Local Knowledge Base Fallback]
    end

    subgraph External [External Services]
        DB[(PostgreSQL Database)]
        Gemini[Google Gemini API]
    end

    UI --> API
    Dash --> API
    Chat --> AI_Service
    Redeem --> API
    
    API --> Auth
    API --> DB
    
    AI_Service -- Valid API Key --> Gemini
    AI_Service -- Invalid/Missing Key --> Fallback
```

## 💻 Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide React
- **Backend:** Node.js, Express.js, PostgreSQL (pg module), JSON Web Tokens (JWT)
- **AI Integration:** Google Generative AI (`@google/generative-ai`)

## 🚀 Prompts & Commands Used
Build a full-stack, working website for PowerSaver AI — a gamified energy-saving platform for college students. Stack: React.js (frontend), Node.js/Express (backend API), MongoDB (database), plus an AI recommendation engine (calls an LLM API for personalized tips). Light theme, clean and modern, mobile-responsive.

Core user flow


Student signs up / logs in
Their power usage (simulated or device-fed) streams into a dashboard in real time
AI engine analyzes usage patterns and generates personalized saving tips
Student earns coins for hitting savings milestones and maintaining daily streaks
Coins and streaks are ranked on a live leaderboard against other students/dorms


Pages & functionality

1. Landing page


Hero section: headline, subheadline, CTA buttons (Sign up / Log in)
Animated impact counter (total kWh saved across all users — pulled live from DB)
"How it works" — 3-step explainer with icons
Testimonial/social proof section
Footer with links


2. Auth (sign up / log in)


Email + password auth (bcrypt hashing, JWT sessions)
Fields at signup: name, email, password, college/dorm (for leaderboard grouping)
Protected routes redirect unauthenticated users to login


3. Dashboard (main app, protected route)


Real-time power usage chart (line/area chart, last 24h and last 7 days toggle)
Current streak counter with flame icon, animates on increment
Coin balance, prominently displayed in navbar
"Today's AI recommendation" card — pulls from the AI engine, refreshes daily
Quick-glance stats: this week's savings vs last week, rank change


4. Leaderboard


Tabs: Individual / By dorm-college
Ranked list: avatar, name, coin total, streak badge
Current user's row highlighted and auto-scrolled into view
Filter by time period: this week / this month / all-time


5. Rewards / milestones


Grid of milestone cards (e.g. "Save 10 kWh this week", "7-day streak", "Top 10 leaderboard")
Progress bar per milestone, coin value shown
Locked (grayed) vs unlocked (colored, celebratory) states
Claim animation when a milestone is completed


6. AI recommendations panel


List of personalized tips, each with: description, estimated coin/kWh savings, "mark as done" action
Tips generated server-side by calling an LLM with the user's recent usage data as context


7. Profile / settings


Edit name, dorm/college, avatar
Notification preferences
Logout


Data model (MongoDB collections)

users: { _id, name, email, passwordHash, dorm, coins, currentStreak, longestStreak, createdAt }
usageReadings: { _id, userId, kwh, timestamp }
milestones: { _id, title, description, targetType, targetValue, coinReward }
userMilestones: { _id, userId, milestoneId, progress, completedAt }
recommendations: { _id, userId, text, estimatedSavingsKwh, status, createdAt }
leaderboardCache: { _id, period, entries: [{ userId, coins, streak, rank }], updatedAt }

API endpoints (Express)

POST   /api/auth/signup
POST   /api/auth/login
GET    /api/users/me
GET    /api/usage/:userId?range=24h|7d
POST   /api/usage/ingest          (device/simulator posts new readings)
GET    /api/leaderboard?period=week|month|all
GET    /api/milestones/:userId
GET    /api/recommendations/:userId
POST   /api/recommendations/generate   (triggers AI engine call)
POST   /api/streaks/checkin

Gamification logic (implement as backend services)


Streaks: increment currentStreak if the user logs a saving day (usage below their rolling average) on consecutive calendar days; reset to 0 on a missed day; update longestStreak accordingly
Coins: awarded on milestone completion (from milestones.coinReward) and on streak checkpoints (e.g. +5 coins every 3-day streak)
Leaderboard: recompute ranks on a schedule (e.g. every 15 min via a cron job) into leaderboardCache rather than computing live on every request


AI recommendation engine


Backend service that, on a schedule or on-demand, sends the user's last 7 days of usageReadings plus their dorm/college context to an LLM (Claude API)
Prompt the model to return 1-3 concrete, actionable tips in JSON: { tips: [{ text, estimatedSavingsKwh }] }
Store results in recommendations; surface the newest on the dashboard


Design system (light theme)


Background: soft off-white (#FAFAF8), card surfaces white with subtle shadow
Primary: green (#22A06B range) for eco/savings actions and success states
Accent: warm amber (#F5A623 range) for coins, rewards, and streak fire
Typography: clean sans-serif (Inter or similar), generous line-height
Cards: 12-16px border radius, soft shadows, no harsh borders
Micro-animations: coin reveal on reward claim, flame pulse on streak increment, number count-up on stat changes
Fully responsive — mobile-first, since students primarily check this on phones


Tech implementation notes


Frontend: React (functional components, hooks), React Router, Tailwind CSS, Recharts or Chart.js for graphs, Axios for API calls
Backend: Node.js + Express, Mongoose for MongoDB, JWT auth middleware, node-cron for scheduled jobs (leaderboard recompute, streak checks)
Real-time updates: WebSocket (Socket.io) or polling every 30s for the dashboard's live usage chart
Deploy-ready: environment variables for DB connection string, JWT secret, and LLM API key.
### Initialization & Setup
```bash
# Frontend Setup
npm create vite@latest client -- --template react
cd client
npm install
npm install tailwindcss @tailwindcss/postcss postcss lucide-react recharts framer-motion react-router-dom

# Backend Setup
mkdir server
cd server
npm init -y
npm install express cors dotenv pg jsonwebtoken @google/generative-ai
```

### Running the Application
**Backend Terminal:**
```bash
cd server
npm start
```
**Frontend Terminal:**
```bash
cd client
npm run dev
```

### Key AI Prompts & Implementations
During the development of the AI Assistant, the following system logic was implemented to handle context:

**1. Contextual AI Generation Prompt (Backend):**
```javascript
const prompt = `You are a helpful and enthusiastic energy-saving assistant for a student living in a dorm. 
Their recent energy usage data is: ${JSON.stringify(recentUsage)}. 
Please provide 2 brief, actionable tips to reduce their energy consumption today. 
Format the response as a JSON array...`
```

**2. Smart NLP Fallback (Handling API Key Issues):**
To ensure the application remains fully functional even without a valid Google AI Studio API key, a local keyword-matching algorithm was implemented in `aiService.js`. 
If the AI API returns an error (e.g., when an OAuth token is passed instead of an API Key), the system automatically defaults to scanning the user's prompt for keywords like `ac`, `heat`, `laundry`, `lights`, and `charger` to provide accurate, context-aware offline responses without crashing the server or displaying generic errors.
#   p o w e r - s a v e r  
 