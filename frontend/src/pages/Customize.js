// src/pages/Customize.js
import React from 'react';
import { Link } from 'react-router-dom';
import techDoodles from '../assets/customize-background.jpg'; // Update the path as necessary
import { useEmailContext } from '../context/EmailContext';

function Customize() {
  const { email, updateEmail } = useEmailContext();

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${techDoodles})` }}
    >
      <div className="bg-white bg-opacity-75 p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-6">Customize Your Summary</h1>
        <input
          type="text"
          placeholder="Enter your email id"
          className="w-full p-3 mb-4 border border-gray-300 rounded"
          value={email}
          onChange={(e) => updateEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter your custom prompt"
          className="w-full p-3 mb-4 border border-gray-300 rounded"
        />
        <button className="w-full p-3 bg-green-500 text-white rounded mb-4">Submit Prompt</button>
        <Link to="/" className="block w-full p-3 bg-gray-500 text-white rounded mb-2">Return Home</Link>
      </div>
    </div>
  );
}

export default Customize;
