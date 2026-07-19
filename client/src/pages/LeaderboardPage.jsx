import { useState } from 'react';
import { Trophy, Flame, User } from 'lucide-react';
import { motion } from 'framer-motion';

const mockLeaderboard = [
  { id: 101, name: "Sarah J.", dorm: "North Hall", coins: 1450, streak: 12, isCurrentUser: false },
  { id: 1, name: "Demo Student", dorm: "North Hall", coins: 1320, streak: 8, isCurrentUser: true },
  { id: 102, name: "Mike T.", dorm: "West Wing", coins: 1280, streak: 5, isCurrentUser: false },
  { id: 103, name: "Elena R.", dorm: "East Quad", coins: 1100, streak: 14, isCurrentUser: false },
  { id: 104, name: "David L.", dorm: "North Hall", coins: 950, streak: 3, isCurrentUser: false },
];

export default function LeaderboardPage() {
  const [filter, setFilter] = useState('individual'); // 'individual' or 'dorm'
  const [time, setTime] = useState('week'); // 'week', 'month', 'all'

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Trophy className="h-8 w-8 text-accent mr-3" />
            Leaderboard
          </h1>
          <p className="text-gray-500 mt-1">See how you stack up against campus.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'individual' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setFilter('individual')}
            >
              Students
            </button>
            <button 
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'dorm' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setFilter('dorm')}
            >
              Dorms
            </button>
          </div>
          
          <select 
            className="input-field py-1.5 text-sm"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <ul className="divide-y divide-gray-100">
          {mockLeaderboard.map((entry, index) => (
            <motion.li 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              key={entry.id} 
              className={`p-4 sm:px-6 flex items-center hover:bg-gray-50 transition-colors ${entry.isCurrentUser ? 'bg-primary-light/30 border-l-4 border-primary' : ''}`}
            >
              <div className="flex items-center w-12 flex-shrink-0">
                <span className={`text-lg font-bold ${index < 3 ? 'text-accent' : 'text-gray-400'}`}>
                  #{index + 1}
                </span>
              </div>
              
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold mr-4 flex-shrink-0 overflow-hidden">
                <User className="h-5 w-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{entry.name} {entry.isCurrentUser && '(You)'}</p>
                <p className="text-xs text-gray-500 truncate">{entry.dorm}</p>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="hidden sm:flex flex-col items-end">
                  <div className="flex items-center text-orange-500">
                    <Flame className="h-4 w-4 mr-1" />
                    <span className="text-sm font-bold">{entry.streak}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Streak</span>
                </div>
                
                <div className="flex flex-col items-end w-20">
                  <div className="flex items-center text-accent">
                    <span className="text-lg font-black">{entry.coins}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Coins</span>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
