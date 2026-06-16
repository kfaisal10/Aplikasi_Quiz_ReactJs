import React from 'react';

export default function Result({ result, username, onRestart, onLogout }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
      <h2 className="text-3xl font-bold text-indigo-600 mb-2">Kuis Selesai!</h2>
      <p className="text-gray-600 mb-6">Kerja bagus, <span className="font-semibold">{username}</span>!</p>
      
      {/* Kriteria G: Menampilkan jumlah benar, salah, & dijawab */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-left mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Soal:</span>
          <span className="font-bold">{result.total}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600">Soal Dikerjakan:</span>
          <span className="font-bold text-blue-600">{result.answered}</span>
        </div>
        <div className="flex justify-between text-green-600 font-semibold">
          <span>Jawaban Benar:</span>
          <span>{result.correct}</span>
        </div>
        <div className="flex justify-between text-red-600 font-semibold">
          <span>Jawaban Salah:</span>
          <span>{result.incorrect}</span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onRestart}
          className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
        >
          Ulangi Kuis Baru
        </button>
        <button
          onClick={onLogout}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-md font-semibold hover:bg-gray-300 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}