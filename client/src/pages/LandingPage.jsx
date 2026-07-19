import { Link } from 'react-router-dom';
import { Zap, TrendingDown, Award, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <header className="px-6 py-4 flex justify-between items-center max-w-7xl w-full mx-auto">
        <div className="flex items-center space-x-2 text-primary">
          <Zap className="h-8 w-8" />
          <span className="text-2xl font-bold tracking-tight text-gray-900">PowerSaver AI</span>
        </div>
        <div className="space-x-4">
          <Link to="/auth" className="btn-secondary">Log in</Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6"
        >
          Save Energy, <br className="hidden md:block"/>
          <span className="text-primary">Earn Rewards.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          The smart, gamified platform for college students to track electricity usage, get AI-powered tips, and compete on the dorm leaderboard.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/auth" className="btn-primary text-lg px-8 py-4 inline-flex shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
            Join the Challenge
          </Link>
        </motion.div>

        {/* Live Impact Counter */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-20 p-8 card bg-white border border-primary/20 max-w-3xl mx-auto"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Live Campus Impact</p>
          <div className="flex justify-center items-end space-x-2">
            <span className="text-6xl font-black text-gray-900">12,450</span>
            <span className="text-2xl text-gray-500 font-bold mb-1">kWh</span>
          </div>
          <p className="text-gray-500 mt-2">saved across all dorms this semester</p>
        </motion.div>

        {/* How it works */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 bg-primary-light text-primary rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <TrendingDown className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Track Usage</h3>
            <p className="text-gray-600">Sync your dorm's smart meter or use our AI estimator to see real-time energy drops.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 bg-accent-light text-accent rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <Award className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Complete Milestones</h3>
            <p className="text-gray-600">Get personalized AI tips, build saving streaks, and earn coins for hitting daily goals.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Climb Ranks</h3>
            <p className="text-gray-600">Compete against other students and rival dorms to claim the top spot on the leaderboard.</p>
          </div>
        </div>
      </main>
      
      <footer className="py-8 text-center text-gray-400 text-sm border-t border-gray-100 bg-white">
        &copy; 2026 PowerSaver AI. Designed for a greener future.
      </footer>
    </div>
  );
}
