import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const InitialSetup = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchInitialSetup();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchInitialSetup = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/initial-setup`);
      setPrompt(response.data.prompt);
    } catch (error) {
      console.error('Error fetching initial setup:', error);
      setError('Failed to fetch initial setup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      setIsLoading(true);
      await axios.post(`${API_URL}/initial-setup`, { prompt });
      setSuccess('Initial setup updated successfully');
    } catch (error) {
      console.error('Error updating initial setup:', error);
      setError('Failed to update initial setup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Initial Setup</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          <strong className="font-bold">Success:</strong>
          <span className="block sm:inline"> {success}</span>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full h-64 p-2 border rounded"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter the initial setup prompt here..."
        />
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default InitialSetup;