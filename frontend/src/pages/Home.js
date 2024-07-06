// src/pages/Home.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import backgroundImage from '../assets/meme.jpg'; // Background image path
import gitLogo from '../assets/git-logo.png'; // Git logo image path

function Home() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = () => {
    if (!email) {
      alert('Please enter your email!');
    } else if (!validateEmail(email)) {
      alert('Please enter a valid email!');
    } else {
      // Proceed with the form submission or other logic
      alert('Email is valid! Proceeding...');
      navigate('/subscribe');
    }
  };

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-white bg-opacity-75 p-10 rounded-lg shadow-lg text-center relative">
        <img src={gitLogo} alt="Git Logo" className="absolute top-4 left-4 w-12 h-12" />
        <h1 className="text-5xl font-bold mb-6">Decoding GPT-Generated Code Made Easy!</h1>
        <p className="text-lg mb-6">
          Ever found yourself lost in the labyrinth of GPT-written code? Fear not! Git Summarizer is here to rescue you from the depths of debugging despair. Our superpower lies in unraveling the mysteries of GitHub repositories, making code understanding as breezy as a summer day. Whether you're a seasoned manager, a curious peer developer, or an enthusiastic learner, Git Summarizer simplifies complexities with a touch of wit and wizardry.
        </p>
        <input
          type="email"
          placeholder="Enter your email address"
          className="w-full p-3 mb-4 border border-gray-300 rounded text-center"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex justify-center space-x-4">
          <button 
            onClick={handleSubmit} 
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Subscribe
          </button>
          <Link to="/customize" className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-700">Customize</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
