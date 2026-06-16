import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Quiz from './components/Quiz';
import Result from './components/Result';

function App() {
  const [user, setUser] = useState(null);
  const [quizState, setQuizState] = useState(null); // Menyimpan progress kuis untuk resume

  // Cek jika ada session login atau kuis yang menggantung di localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('quiz_user');
    const savedProgress = localStorage.getItem('quiz_progress');

    if (savedUser) {
      setUser(savedUser);
    }
    if (savedProgress) {
      setQuizState(JSON.parse(savedProgress));
    }
  }, []);

  const handleLogin = (username) => {
    setUser(username);
    localStorage.setItem('quiz_user', username);
  };

  const handleLogout = () => {
    setUser(null);
    setQuizState(null);
    localStorage.removeItem('quiz_user');
    localStorage.removeItem('quiz_progress');
  };

  const handleFinishQuiz = (scoreData) => {
    setQuizState({ status: 'finished', ...scoreData });
    localStorage.setItem('quiz_progress', JSON.stringify({ status: 'finished', ...scoreData }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : quizState?.status === 'finished' ? (
        <Result 
          result={quizState} 
          username={user} 
          onRestart={() => {
            localStorage.removeItem('quiz_progress');
            setQuizState(null);
          }} 
          onLogout={handleLogout}
        />
      ) : (
        <Quiz 
          username={user} 
          savedProgress={quizState}
          onFinish={handleFinishQuiz} 
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;