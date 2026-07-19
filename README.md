# PowerSaver AI – Professional Product Prompt

## Objective

Build a modern, gamified web application that helps college students proactively track their energy usage, build sustainable habits, and receive AI-driven recommendations on how to save power.

The application should look like a premium, consumer-friendly platform with a clean UI, smooth gamified micro-interactions, excellent spacing, and mobile-first responsive design to incentivize continuous engagement.

## Design Style

Create a premium, clean, and modern web application inspired by top-tier consumer apps:
- **Theme:** Light theme with a soft off-white background (`#FAFAF8`) and white card surfaces with subtle shadows. No harsh borders.
- **Color Palette:** 
  - Primary: Green (`#22A06B` range) for eco/savings actions and success states.
  - Accent: Warm amber (`#F5A623` range) for coins, rewards, and streak fire indicators.
- **Typography:** Clean sans-serif (Inter, Roboto, or similar) with generous line-height for readability.
- **Micro-animations:** Coin reveal animations on reward claims, flame pulse animations on streak increments, and number count-ups on stat changes.

## Core User Flow

- **Authentication:** Student signs up or logs in securely.
- **Real-Time Tracking:** Their power usage (simulated or device-fed) streams into a dashboard in real time.
- **Intelligent Feedback:** An AI engine analyzes usage patterns and generates personalized saving tips.
- **Gamification:** Students earn virtual coins for hitting savings milestones and maintaining daily streaks.
- **Community:** Coins and streaks are ranked on a live leaderboard against other students and dorms.

## Pages & Functionality

**1. Landing Page**
- Hero section with headline, subheadline, and CTA buttons (Sign up / Log in).
- Animated impact counter displaying total kWh saved across all users.
- "How it works" 3-step explainer with icons.

**2. Authentication**
- Email and password authentication using JWT sessions.
- Fields at signup: Name, email, password, and college/dorm selection (for leaderboard grouping).

**3. Dashboard (Main App)**
- Real-time power usage chart (Area chart with 24h and 7d toggles).
- Current streak counter with an animated flame icon.
- Coin balance prominently displayed.
- "Today's AI Recommendation" card that pulls from the AI engine and refreshes daily.

**4. Leaderboard**
- Tabs to filter by Individual or By Dorm/College.
- Ranked list displaying avatar, name, coin total, and streak badge.
- Current user's row highlighted and auto-scrolled into view.

**5. Rewards & Milestones**
- Grid of milestone cards (e.g., "Save 10 kWh this week", "7-day streak").
- Progress bar per milestone showing coin value.
- Locked (grayed out) vs unlocked (colored, celebratory) states.

**6. AI Recommendations Panel**
- List of personalized tips with descriptions, estimated savings, and a "mark as done" action.
- Fallback NLP logic to ensure offline functionality when API keys are unavailable.

## Data Model & API Endpoints

**Database Schema (PostgreSQL):**
- `users`: id, name, email, password_hash, dorm, coins, current_streak
- `usage_readings`: id, user_id, kwh, timestamp
- `milestones`: id, title, description, target_type, target_value, coin_reward
- `user_milestones`: id, user_id, milestone_id, progress
- `recommendations`: id, user_id, text, estimated_savings_kwh, status

**Backend Routes (Express):**
- `POST /api/auth/signup` & `POST /api/auth/login`
- `GET /api/users/me`
- `GET /api/usage/:userId`
- `GET /api/leaderboard`
- `POST /api/recommendations/generate`
- `POST /api/streaks/checkin`

## Architecture & Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, Recharts, Lucide React.
- **Backend:** Node.js, Express.js, PostgreSQL.
- **AI Integration:** Google Generative AI (`@google/generative-ai`) with a local knowledge base fallback.
- **Deployment:** Environment variables for DB connection string, JWT secret, and LLM API key.

```bash
# To run the frontend:
cd client
npm run dev

# To run the backend:
cd server
npm start
```