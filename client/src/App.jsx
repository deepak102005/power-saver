import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import LeaderboardPage from './pages/LeaderboardPage';
import RewardsPage from './pages/RewardsPage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-background">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        <main className="flex-1 flex flex-col w-full">
          <Routes>
            <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} />
            <Route path="/auth" element={!user ? <AuthPage onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? <DashboardPage user={user} /> : <Navigate to="/auth" />} />
            <Route path="/leaderboard" element={user ? <LeaderboardPage /> : <Navigate to="/auth" />} />
            <Route path="/rewards" element={user ? <RewardsPage user={user} onUserUpdate={handleLogin} /> : <Navigate to="/auth" />} />
            <Route path="/profile" element={user ? <ProfilePage user={user} onUserUpdate={handleLogin} /> : <Navigate to="/auth" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
