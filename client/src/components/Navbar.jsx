import { Link } from 'react-router-dom';
import { Zap, Trophy, Gift, LogOut } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-gray-900 tracking-tight">PowerSaver</span>
            </Link>
            
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              <Link to="/dashboard" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
              <Link to="/leaderboard" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Leaderboard</Link>
              <Link to="/rewards" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Rewards</Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center bg-accent-light px-3 py-1 rounded-full border border-accent/20">
              <Trophy className="h-4 w-4 text-accent mr-1" />
              <span className="font-bold text-accent">{user?.coins || 0}</span>
            </div>
            
            <div className="relative flex items-center gap-4">
              <Link to="/profile" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold shadow-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </Link>
              <button onClick={onLogout} className="text-gray-400 hover:text-red-500 transition-colors" title="Logout">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile nav */}
      <div className="sm:hidden border-t border-gray-200 bg-white flex justify-around p-2">
        <Link to="/dashboard" className="p-2 text-gray-600 hover:text-primary"><Zap className="h-5 w-5 mx-auto" /><span className="text-[10px]">Home</span></Link>
        <Link to="/leaderboard" className="p-2 text-gray-600 hover:text-primary"><Trophy className="h-5 w-5 mx-auto" /><span className="text-[10px]">Rank</span></Link>
        <Link to="/rewards" className="p-2 text-gray-600 hover:text-primary"><Gift className="h-5 w-5 mx-auto" /><span className="text-[10px]">Rewards</span></Link>
      </div>
    </nav>
  );
}
