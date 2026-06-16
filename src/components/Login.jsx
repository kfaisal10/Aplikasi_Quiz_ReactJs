import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) onLogin(username);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Selamat Datang di Quiz App</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Anda</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Masukkan nama kamu..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
        >
          Mulai Kuis
        </button>
      </form>
    </div>
  );
}