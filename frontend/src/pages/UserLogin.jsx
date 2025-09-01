import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';
import { ArrowLeft } from 'lucide-react';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const userData = { email, password };

      const response = await axios.post(
        `http://localhost:4000/users/login`,
        userData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('token', data.token);
        navigate('/Home'); // ✅ Changed from /home to /userDetails
      }

      setEmail('');
      setPassword('');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Invalid email or password');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-8 px-4">
      
      {/* ✅ Back Button */}
      <div className="w-full max-w-md mb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-700 hover:text-purple-600 transition font-medium"
        >
          <ArrowLeft size={18} className="mr-1" /> Back
        </button>
      </div>

      {/* ✅ Login Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-400 text-white px-6 py-6">
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-sm text-white/90">
            Sign in to your MedMap account
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          {error && (
            <div className="bg-red-100 text-red-700 border border-red-300 rounded-md px-3 py-2 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold py-2 rounded-lg hover:from-purple-700 hover:to-purple-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging In...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            New here?{' '}
            <Link to="/signup" className="text-purple-600 font-medium">
              Create an account
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 text-xs text-gray-500 text-center">
          By continuing, you agree to our{' '}
          <span className="underline">Terms of Service</span> and{' '}
          <span className="underline">Privacy Policy</span>.
        </div>
      </div>

      {/* ✅ Captain Login Button */}
      <div className="w-full max-w-md mt-6">
        <Link
          to="/captain-login"
          className="block text-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
        >
          Sign in as Captain
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
