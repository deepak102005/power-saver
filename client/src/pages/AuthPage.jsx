import { useState } from 'react';
import { Zap } from 'lucide-react';

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', dorm: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // In a real app, this calls the backend. 
    // For now, we simulate a successful login to unblock UI development.
    try {
      const endpoint = isLogin ? 'login' : 'signup';
      const url = `http://localhost:5000/api/auth/${endpoint}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      console.warn("Backend not running or error, using mock data", err);
      // Fallback for development if backend isn't ready
      const mockUser = {
        id: 1,
        name: formData.name || 'Demo Student',
        email: formData.email,
        dorm: formData.dorm || 'North Hall',
        coins: 150,
        current_streak: 3
      };
      localStorage.setItem('token', 'mock_token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      onLogin(mockUser);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Zap className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Welcome back' : 'Create an account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="mt-1">
                    <input name="name" type="text" required={!isLogin} className="input-field" 
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">College / Dorm</label>
                  <div className="mt-1">
                    <input name="dorm" type="text" required={!isLogin} className="input-field" placeholder="e.g. North Hall"
                      value={formData.dorm} onChange={e => setFormData({...formData, dorm: e.target.value})} />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1">
                <input name="email" type="email" required className="input-field" 
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1">
                <input name="password" type="password" required className="input-field" 
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <div>
              <button type="submit" className="w-full btn-primary py-3">
                {isLogin ? 'Sign in' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:text-primary-hover text-sm font-medium">
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
