'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiAward, FiLogOut, FiArrowRight, FiEdit, FiSave, FiX } from 'react-icons/fi';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface UserProfile {
  Name: string;
  Age: number;
  Monthly_Income: number;
  Monthly_Saving: number;
  Primary_Reason_For_Investing: string;
  Feel_About_Financial_Risk: string;
  Experience_About_Investing: string;
  Estimated_Investing_Duration: number;
  Types_Of_Investment_Interest_You_The_Most: string[];
  Portfolio: string[];
}

const investmentReasons = [
  "Retirement savings",
  "Wealth accumulation",
  "Education funding",
  "Home purchase",
  "Financial independence"
];

const riskLevels = ["Low", "Moderate", "High"];
const experienceLevels = ["Beginner", "Intermediate", "Advanced"];
const investmentTypes = ["Stocks", "Bonds", "ETFs", "Mutual Funds", "Real Estate", "Cryptocurrency"];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    age: 25,
    monthlyincome: 0,
    monthlysaving: 0,
    primaryreasonforinvesting: 'Retirement savings',
    financialrisk: 'Moderate',
    expaboutinvesting: 'Beginner',
    estimateinvestingduration: 5,
    typesofinvestment: [] as string[],
    portfolio: [] as string[]
  });

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const response = await fetch('https://tutor-api-gdg.vercel.app/v1/profile', {
            headers: {
              'Authorization': `Bearer ${await user.getIdToken()}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.profile) {
              setUserProfile(data.profile);
              setFormData({
                name: data.profile.Name || '',
                age: data.profile.Age || 25,
                monthlyincome: data.profile.Monthly_Income || 0,
                monthlysaving: data.profile.Monthly_Saving || 0,
                primaryreasonforinvesting: data.profile.Primary_Reason_For_Investing || 'Retirement savings',
                financialrisk: data.profile.Feel_About_Financial_Risk || 'Moderate',
                expaboutinvesting: data.profile.Experience_About_Investing || 'Beginner',
                estimateinvestingduration: data.profile.Estimated_Investing_Duration || 5,
                typesofinvestment: data.profile.Types_Of_Investment_Interest_You_The_Most || [],
                portfolio: data.profile.Portfolio || []
              });
            }
          } else if (response.status === 404) {
            // Profile doesn't exist yet
            setUserProfile(null);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      setIsSigningOut(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const method = userProfile ? 'PUT' : 'POST';
      const response = await fetch('https://tutor-api-gdg.vercel.app/v1/profile', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user?.getIdToken()}`
        },
        body: JSON.stringify({
          name: formData.name,
          age: formData.age,
          monthlyincome: formData.monthlyincome,
          monthlysaving: formData.monthlysaving,
          primaryreasonforinvesting: formData.primaryreasonforinvesting,
          financialrisk: formData.financialrisk,
          expaboutinvesting: formData.expaboutinvesting,
          estimateinvestingduration: formData.estimateinvestingduration,
          typesofinvestment: formData.typesofinvestment,
          portfolio: formData.portfolio
        })
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.profile);
        setIsEditing(false);
      } else {
        throw new Error('Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleInvestmentType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      typesofinvestment: prev.typesofinvestment.includes(type)
        ? prev.typesofinvestment.filter(t => t !== type)
        : [...prev.typesofinvestment, type]
    }));
  };

  const addToPortfolio = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      setFormData(prev => ({
        ...prev,
        portfolio: [...prev.portfolio, e.currentTarget.value]
      }));
      e.currentTarget.value = '';
    }
  };

  const removeFromPortfolio = (index: number) => {
    setFormData(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, i) => i !== index)
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700"
        >
          <h2 className="text-2xl font-bold mb-4">Please sign in</h2>
          <p className="mb-6 text-gray-400">You need to be signed in to view your profile</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/auth/login')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium"
          >
            Sign In
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      {/* Background Gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-900 to-gray-800" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Your Profile
          </h1>
          {!isEditing && userProfile && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              <FiEdit /> Edit Profile
            </motion.button>
          )}
        </motion.div>

        {isEditing ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700 mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Edit Profile</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-700/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                    className="w-full bg-gray-700/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Monthly Income (₹)</label>
                  <input
                    type="number"
                    value={formData.monthlyincome}
                    onChange={(e) => setFormData({...formData, monthlyincome: parseFloat(e.target.value)})}
                    className="w-full bg-gray-700/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Monthly Savings (₹)</label>
                  <input
                    type="number"
                    value={formData.monthlysaving}
                    onChange={(e) => setFormData({...formData, monthlysaving: parseFloat(e.target.value)})}
                    className="w-full bg-gray-700/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Primary Reason for Investing</label>
                <select
                  value={formData.primaryreasonforinvesting}
                  onChange={(e) => setFormData({...formData, primaryreasonforinvesting: e.target.value})}
                  className="w-full bg-gray-700/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {investmentReasons.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Financial Risk Tolerance</label>
                  <select
                    value={formData.financialrisk}
                    onChange={(e) => setFormData({...formData, financialrisk: e.target.value})}
                    className="w-full bg-gray-700/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {riskLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Investing Experience</label>
                  <select
                    value={formData.expaboutinvesting}
                    onChange={(e) => setFormData({...formData, expaboutinvesting: e.target.value})}
                    className="w-full bg-gray-700/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Estimated Investing Duration (years)</label>
                <input
                  type="number"
                  value={formData.estimateinvestingduration}
                  onChange={(e) => setFormData({...formData, estimateinvestingduration: parseInt(e.target.value)})}
                  className="w-full bg-gray-700/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Investment Interests</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {investmentTypes.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleInvestmentType(type)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        formData.typesofinvestment.includes(type)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Current Portfolio</label>
                <input
                  type="text"
                  placeholder="Add an investment (press Enter)"
                  onKeyDown={addToPortfolio}
                  className="w-full bg-gray-700/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                />
                <div className="flex flex-wrap gap-2">
                  {formData.portfolio.map((item, index) => (
                    <div key={index} className="flex items-center bg-gray-700 rounded-full px-3 py-1">
                      <span className="text-sm">{item}</span>
                      <button
                        type="button"
                        onClick={() => removeFromPortfolio(index)}
                        className="ml-2 text-gray-400 hover:text-white"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition flex items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : (
                    <>
                      <FiSave /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-gray-700 mb-8"
            >
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
                {/* Avatar */}
                <motion.div 
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-purple-500/30 overflow-hidden"
                >
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || 'User avatar'}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <FiUser className="text-gray-400 text-4xl" />
                    </div>
                  )}
                </motion.div>

                {/* User Info */}
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl md:text-3xl font-bold"
                  >
                    {userProfile?.Name || user.displayName || 'Anonymous Trader'}
                  </motion.h2>
                  
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-400"
                  >
                    {user.email}
                  </motion.p>

                  {userProfile && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 text-sm">
                      <div className="bg-gray-700/30 p-3 rounded-lg">
                        <p className="text-gray-400">Age</p>
                        <p className="font-medium">{userProfile.Age}</p>
                      </div>
                      <div className="bg-gray-700/30 p-3 rounded-lg">
                        <p className="text-gray-400">Income</p>
                        <p className="font-medium">₹{userProfile.Monthly_Income.toLocaleString()}/mo</p>
                      </div>
                      <div className="bg-gray-700/30 p-3 rounded-lg">
                        <p className="text-gray-400">Savings</p>
                        <p className="font-medium">₹{userProfile.Monthly_Saving.toLocaleString()}/mo</p>
                      </div>
                      <div className="bg-gray-700/30 p-3 rounded-lg">
                        <p className="text-gray-400">Risk Level</p>
                        <p className="font-medium">{userProfile.Feel_About_Financial_Risk}</p>
                      </div>
                      <div className="bg-gray-700/30 p-3 rounded-lg">
                        <p className="text-gray-400">Experience</p>
                        <p className="font-medium">{userProfile.Experience_About_Investing}</p>
                      </div>
                      <div className="bg-gray-700/30 p-3 rounded-lg">
                        <p className="text-gray-400">Duration</p>
                        <p className="font-medium">{userProfile.Estimated_Investing_Duration} years</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Investment Details */}
            {userProfile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700 mb-8"
              >
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <FiAward className="text-yellow-400" />
                  Investment Preferences
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-gray-400 mb-2">Primary Goal</h3>
                    <p className="font-medium">{userProfile.Primary_Reason_For_Investing}</p>
                  </div>

                  <div>
                    <h3 className="text-gray-400 mb-2">Investment Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.Types_Of_Investment_Interest_You_The_Most.map((type, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-gray-400 mb-2">Current Portfolio</h3>
                    {userProfile.Portfolio.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {userProfile.Portfolio.map((item, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No investments added yet</p>
                    )}
                  </div>
                </div> 
              </motion.div>
            )}
          </>
        )}

        {/* Sign Out Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSignOut}
            disabled={isSigningOut}
            className={`px-8 py-3 rounded-lg font-medium flex items-center gap-2 ${
              isSigningOut 
                ? 'bg-gray-600 text-gray-400' 
                : 'bg-gradient-to-r from-red-600 to-red-800 text-white'
            }`}
          >
            {isSigningOut ? (
              'Signing Out...'
            ) : (
              <>
                <FiLogOut /> Sign Out
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}