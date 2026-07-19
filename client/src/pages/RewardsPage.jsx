import { useState } from 'react';
import { Gift, Lock, CheckCircle, Zap, Tag, Coffee, ShoppingBag, Wind } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockMilestones = [
  { id: 1, title: "First Step", description: "Save your first 10 kWh", target: 10, current: 10, reward: 50, completed: true, claimed: true },
  { id: 2, title: "Consistency is Key", description: "Maintain a 7-day streak", target: 7, current: 3, reward: 100, completed: false },
  { id: 3, title: "Eco Warrior", description: "Save 50 kWh", target: 50, current: 12, reward: 200, completed: false },
  { id: 4, title: "Top 10%", description: "Reach top 10% on leaderboard", target: 1, current: 0, reward: 500, completed: false },
  { id: 5, title: "Night Owl", description: "Reduce usage after 10PM for a week", target: 7, current: 7, reward: 150, completed: true, claimed: false },
];

const mockCoupons = [
  { id: 1, title: "$5 Campus Coffee", description: "Get a free latte or pastry at the campus cafe.", cost: 300, icon: Coffee },
  { id: 2, title: "10% Off Bookstore", description: "Valid on all apparel and school supplies.", cost: 500, icon: ShoppingBag },
  { id: 3, title: "Free Laundry Token", description: "One free wash & dry cycle in any dorm.", cost: 150, icon: Wind },
];

export default function RewardsPage({ user, onUserUpdate }) {
  const [milestones, setMilestones] = useState(mockMilestones);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationMessage, setAnimationMessage] = useState('');

  const currentCoins = user?.coins || 150;

  const handleClaim = (id) => {
    const milestone = milestones.find(m => m.id === id);
    if (!milestone) return;

    setMilestones(milestones.map(m => m.id === id ? { ...m, claimed: true } : m));
    
    // Calculate new total coins
    const newCoins = currentCoins + milestone.reward;
    if (onUserUpdate) onUserUpdate({ ...user, coins: newCoins });
    localStorage.setItem('user', JSON.stringify({ ...user, coins: newCoins }));

    setAnimationMessage(`+${milestone.reward} Coins Earned!`);
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 2500);
  };

  const handleRedeem = (coupon) => {
    if (currentCoins < coupon.cost) {
      alert(`Not enough coins! You need ${coupon.cost - currentCoins} more.`);
      return;
    }
    
    // Deduct coins
    const newCoins = currentCoins - coupon.cost;
    if (onUserUpdate) onUserUpdate({ ...user, coins: newCoins });
    localStorage.setItem('user', JSON.stringify({ ...user, coins: newCoins }));
    
    setAnimationMessage(`Redeemed ${coupon.title}! Check your email.`);
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 relative overflow-hidden">
      
      {/* Animation Overlay */}
      <AnimatePresence>
        {showAnimation && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: -100 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
          >
            <div className="bg-white px-8 py-6 rounded-3xl shadow-2xl flex flex-col items-center border border-primary/20">
              <Gift className="h-16 w-16 text-accent mb-4 animate-bounce" />
              <p className="text-2xl font-black text-gray-900 text-center">{animationMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Gift className="h-8 w-8 text-primary mr-3" />
            Rewards & Milestones
          </h1>
          <p className="text-gray-500 mt-1">Complete challenges to earn coins and redeem coupons.</p>
        </div>
        <div className="hidden sm:flex flex-col items-end">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Your Balance</p>
          <div className="flex items-center text-3xl font-black text-accent bg-accent-light/50 px-4 py-2 rounded-xl border border-accent/20 shadow-sm">
            <Zap className="h-6 w-6 mr-2" />
            {currentCoins}
          </div>
        </div>
      </div>

      {/* Coupons Store Section */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center border-b pb-2">
          <Tag className="h-6 w-6 text-accent mr-2" />
          Redeem Coupons
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockCoupons.map((coupon, index) => {
            const canAfford = currentCoins >= coupon.cost;
            const Icon = coupon.icon;
            
            return (
              <motion.div 
                key={coupon.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="card bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-accent/50 hover:shadow-lg transition-all group flex flex-col h-full"
              >
                <div className="flex-1">
                  <div className="h-12 w-12 bg-accent-light text-accent rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{coupon.title}</h3>
                  <p className="text-sm text-gray-500 mt-2">{coupon.description}</p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className={`font-bold flex items-center ${canAfford ? 'text-accent' : 'text-red-400'}`}>
                    <Zap className="h-4 w-4 mr-1" />
                    {coupon.cost}
                  </div>
                  <button 
                    onClick={() => handleRedeem(coupon)}
                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${canAfford ? 'bg-accent text-white hover:bg-accent-hover shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  >
                    Redeem
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Milestones Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center border-b pb-2">
          <CheckCircle className="h-6 w-6 text-primary mr-2" />
          Earn Coins
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {milestones.map((milestone, index) => {
            const progressPercent = Math.min(100, Math.round((milestone.current / milestone.target) * 100));
            const isLocked = !milestone.completed && progressPercent < 100;
            const canClaim = milestone.completed && milestone.claimed === false;

            return (
              <motion.div 
                key={milestone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`card relative overflow-hidden flex flex-col h-full ${isLocked ? 'bg-gray-50/50' : 'bg-white border-primary/20 shadow-md'}`}
              >
                {isLocked && (
                  <div className="absolute top-4 right-4 text-gray-300">
                    <Lock className="h-5 w-5" />
                  </div>
                )}
                {milestone.completed && milestone.claimed !== false && (
                  <div className="absolute top-4 right-4 text-primary bg-primary-light rounded-full p-1">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                )}
                
                <div className="mb-4 flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`px-2 py-1 text-xs font-bold rounded flex items-center ${isLocked ? 'bg-gray-200 text-gray-500' : 'bg-accent-light text-accent border border-accent/20'}`}>
                      <Zap className="h-3 w-3 mr-1" />
                      {milestone.reward} Coins
                    </div>
                  </div>
                  <h3 className={`text-lg font-bold ${isLocked ? 'text-gray-500' : 'text-gray-900'}`}>{milestone.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{milestone.description}</p>
                </div>

                <div className="mt-auto">
                  <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{milestone.current} / {milestone.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className={`h-2 rounded-full ${isLocked ? 'bg-gray-400' : 'bg-primary'}`} 
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  
                  {canClaim && (
                    <button 
                      onClick={() => handleClaim(milestone.id)}
                      className="w-full btn-primary py-2 animate-pulse"
                    >
                      Claim Reward
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
