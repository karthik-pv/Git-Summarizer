// src/pages/Subscribe.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import subscribeBg from "../assets/subscribe-background.jpeg"; // Background image path
import subscribeImage from "../assets/jacksparrow.jpg"; // Additional image path
import { useEmailContext } from "../context/EmailContext";
import { BASE_URL } from "../api/url";
import axios from "axios";

function Subscribe() {
  const { email, updateEmail } = useEmailContext();
  const [role, setRole] = useState(""); // State to manage selected role
  const [repoUrl, setRepoUrl] = useState(""); // State to manage repository URL
  const navigate = useNavigate(); // useNavigate hook for redirection

  const handleRoleChange = (e) => {
    setRole(e.target.value); // Update role state on dropdown change
  };
  const handleRepoUrlChange = (e) => {
    setRepoUrl(e.target.value); // Update repository URL state on input change
  };

  const handleSubmit = async () => {
    // Perform validation or any necessary logic
    // For demonstration, directly navigate to confirmation page
    await axios.post(BASE_URL + "/subscription/addSubscription", {
      email: email,
      repository: repoUrl,
      subscriptionType: role,
    });
    navigate("/confirmation");
  };

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${subscribeBg})` }}
    >
      <div className="bg-white bg-opacity-75 p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-6">
          Does any Github repository make you feel like this?
          <br />
          Send it our way, we gotchu! Savvy?
        </h1>
        <img
          src={subscribeImage}
          alt="Subscribe"
          className="mb-6 w-1/2 mx-auto"
        />
        <input
          type="text"
          placeholder="Enter GitHub repo URL"
          value={repoUrl}
          onChange={handleRepoUrlChange} // Handle repository URL input change
          className="w-full p-3 mb-4 border border-gray-300 rounded"
        />
        <select
          value={role}
          onChange={handleRoleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded"
        >
          <option value="">Select your role</option>
          <option value="Manager">Manager</option>
          <option value="Peer Developer">Peer Developer</option>
          <option value="Learner">Learner</option>
        </select>
        <button
          onClick={handleSubmit}
          className="w-full p-3 bg-blue-500 text-white rounded mb-4"
        >
          Subscribe
        </button>
        <Link
          to="/"
          className="block w-full p-3 bg-gray-500 text-white rounded"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

export default Subscribe;
