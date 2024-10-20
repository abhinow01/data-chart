import React from 'react';
import { useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import axios from 'axios';
const base_url = process.env.BASE_URL
const Home = () => {
    const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleSignup = async (e) => {
        // e.preventDefault();
        try {
          const response = await axios.post(`${base_url}/api/auth/signup`, {
            username,
            email,
            password,
          });
    
          if (response.data.success) {
            // Store the token 
            localStorage.setItem('token', response.data.token);
            navigate('/chart'); 
          } else {
            console.error('Signup failed');
          }
        } catch (error) {
          console.error('Error during signup', error);
        }
      };
    
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">Sign Up</h2>
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handleSignup()}>
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Already a member?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Home;