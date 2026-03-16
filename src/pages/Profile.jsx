import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userApi from '../api/userApi';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userData = await userApi.getProfile();
      setProfile(userData);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <button
            onClick={handleLogout}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto p-6 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-purple-400 to-pink-500"></div>

          {/* Profile Info */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start -mt-16">
              <img
                src={profile?.profilePicture || 'https://via.placeholder.com/128'}
                alt={profile?.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className="mt-4 md:mt-16 md:ml-6 text-center md:text-left flex-1">
                <h2 className="text-3xl font-bold text-gray-800">{profile?.name}</h2>
                <p className="text-gray-600 mt-1">{profile?.email}</p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Email Address</h3>
                <p className="text-gray-800">{profile?.email}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Mobile Number</h3>
                <p className="text-gray-800">{profile?.mobile}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Account Status</h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Member Since</h3>
                <p className="text-gray-800">{new Date(profile?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Edit Profile
              </button>
              <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
                Change Password
              </button>
              <button 
                onClick={handleLogout}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
