import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';
import { ArrowLeft } from 'lucide-react';

const UserSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');

    if (!firstName || firstName.trim().length < 3) {
      setError('First name must be at least 3 characters long');
      return;
    }
    if (!lastName || lastName.trim().length < 3) {
      setError('Last name must be at least 3 characters long');
      return;
    }
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        newUser
      );
      if (response.status === 201) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('token', data.token);
        navigate('/userDetails'); // Navigate to user details page after signup
      }
      setEmail('');
      setFirstName('');
      setLastName('');
      setPassword('');
    } catch (err) {
      const backendErrors = err?.response?.data?.errors;
      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        setError(backendErrors[0]?.msg || 'Validation error');
      } else if (typeof err?.response?.data?.message === 'string') {
        setError(err.response.data.message);
      } else if (typeof err?.message === 'string') {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-8 px-4">
      
      {/* ✅ Back Button Positioned Outside Card */}
      <div className="w-full max-w-md mb-4">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center text-gray-700 hover:text-purple-600 transition font-medium"
        >
          <ArrowLeft size={18} className="mr-1" /> Back
        </button>
      </div>

      {/* ✅ Signup Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-400 text-white px-6 py-6">
          <h2 className="text-2xl font-bold">Join MedMap</h2>
          <p className="text-sm text-white/90">
            Create your emergency medical profile
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
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                minLength={3}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                minLength={3}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email Address</label>
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
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold py-2 rounded-lg hover:from-purple-700 hover:to-purple-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 font-medium">
              Login here
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
    </div>
  );
};

export default UserSignup;
