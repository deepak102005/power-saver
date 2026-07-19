import { useState } from 'react';
import { User, Mail, Building, Bell, Shield, Save, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage({ user, onUserUpdate }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    dorm: user?.dorm || '',
    notifications: true
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      if(onUserUpdate) onUserUpdate(updatedUser);
      setIsSaving(false);
      alert('Profile updated successfully!');
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <User className="h-8 w-8 text-primary mr-3" />
          Profile & Settings
        </h1>
        <p className="text-gray-500 mt-1">Manage your account details and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Avatar & Quick Info */}
        <div className="md:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="card flex flex-col items-center text-center"
          >
            <div className="relative group cursor-pointer mb-4">
              <div className="h-32 w-32 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-5xl overflow-hidden border-4 border-white shadow-lg">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white h-8 w-8" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500 text-sm flex items-center mt-1">
              <Building className="h-4 w-4 mr-1" />
              {user?.dorm}
            </p>
            <div className="w-full mt-6 pt-6 border-t border-gray-100 flex justify-around">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Level</p>
                <p className="text-lg font-black text-primary">4</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Joined</p>
                <p className="text-lg font-black text-gray-900">2026</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="card p-5 bg-gradient-to-br from-gray-50 to-gray-100 border-none"
          >
            <h3 className="font-bold flex items-center text-gray-700 mb-2">
              <Shield className="h-5 w-5 mr-2 text-gray-500" />
              Account Security
            </h3>
            <p className="text-xs text-gray-500 mb-4">Your account is secured with standard encryption.</p>
            <button className="text-sm font-medium text-primary hover:text-primary-hover w-full text-left">
              Change Password &rarr;
            </button>
          </motion.div>
        </div>

        {/* Right Column - Form */}
        <div className="md:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="card"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        className="input-field pl-10" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="email" 
                        className="input-field pl-10" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dorm / Location</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        className="input-field pl-10" 
                        value={formData.dorm}
                        onChange={(e) => setFormData({...formData, dorm: e.target.value})}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">This determines your leaderboard grouping.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Preferences</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-white rounded-full shadow-sm flex items-center justify-center text-primary mr-4">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Push Notifications</p>
                      <p className="text-xs text-gray-500">Receive alerts for AI tips and milestones.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formData.notifications}
                      onChange={(e) => setFormData({...formData, notifications: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="btn-primary px-8 flex items-center"
                >
                  {isSaving ? 'Saving...' : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
