// src/pages/Subscribe.js
import React, { useState , useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import subscribeBg from '../assets/subscribe-background.jpeg'; // Background image path
import subscribeImage from '../assets/jacksparrow.jpg'; // Additional image path
import { useEmailContext } from '../context/EmailContext';

function Subscribe() {
  const { email, updateEmail } = useEmailContext();
  const [role, setRole] = useState(''); // State to manage selected role
  const navigate = useNavigate(); // useNavigate hook for redirection

  const handleRoleChange = (e) => {
    setRole(e.target.value); // Update role state on dropdown change
  };

  const handleSubmit = () => {
    // Perform validation or any necessary logic
    // For demonstration, directly navigate to confirmation page
    navigate('/confirmation');
  };

  useEffect(()=>{
    alert(email);
  },[]);

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${subscribeBg})` }}
    >
      <div className="bg-white bg-opacity-75 p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-6">Does any Github repository make you feel like this?<br />Send it our way, we gotchu! Savvy?</h1>
        <img src={subscribeImage} alt="Subscribe" className="mb-6 w-1/2 mx-auto" />
        <input
          type="text"
          placeholder="Enter GitHub repo URL"
          className="w-full p-3 mb-4 border border-gray-300 rounded"
        />
        <select
          value={role}
          onChange={handleRoleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded"
        >
          <option value="">Select your role</option>
          <option value="manager">Manager</option>
          <option value="peer-developer">Peer Developer</option>
          <option value="learner">Learner</option>
        </select>
        <button onClick={handleSubmit} className="w-full p-3 bg-blue-500 text-white rounded mb-4">
          Subscribe
        </button>
        <Link to="/" className="block w-full p-3 bg-gray-500 text-white rounded">
          Return Home
        </Link>
      </div>
    </div>
  );
}

export default Subscribe;
