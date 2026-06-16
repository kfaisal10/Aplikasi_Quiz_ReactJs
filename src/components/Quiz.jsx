import React, { useState, useEffect } from 'react';

export default function Quiz({ username, savedProgress, onFinish, onLogout }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // Menyimpan jawaban user
  const [timeLeft, setTimeLeft] = useState(60); // Setting waktu 60 detik
  const [loading, setLoading] = useState(true);

  // 1. Fetch Soal dari OpenTDB atau Resume dari local storage
  useEffect(() => {
    if (savedProgress && savedProgress.status === 'ongoing') {
      setQuestions(savedProgress.questions);
      setCurrentIndex(savedProgress.currentIndex);
      setAnswers(savedProgress.answers);
      setTimeLeft(savedProgress.timeLeft);
      setLoading(false);
    } else {
      // Mengambil 10 soal umum, kategori 11 (Entertainment: Music) tipe pilihan ganda (multiple choice)
      fetch('https://opentdb.com/api.php?amount=5&category=11&difficulty=easy&type=multiple')
        .then((res) => res.json())
        .then((data) => {
          if (data.results) {
            // Gabungkan & acak opsi jawaban agar tidak selalu di akhir
            const formatted = data.results.map((q) => {
              const allOptions = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
              return { ...q, allOptions };
            });
            setQuestions(formatted);
          }
          setLoading(false);
        })
        .catch((err) => console.error("Gagal mengambil data API", err));
    }
  }, []);

  // 2. Efek Timer & Auto-Save untuk fitur Resume (Kriteria E & H)
  useEffect(() => {
    if (loading || questions.length === 0) return;

    if (timeLeft <= 0) {
      calculateResult();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    // Menyimpan state berkala ke localStorage sewaktu-waktu browser ditutup
    const progress = {
      status: 'ongoing',
      questions,
      currentIndex,
      answers,
      timeLeft: timeLeft - 1
    };
    localStorage.setItem('quiz_progress', JSON.stringify(progress));

    return () => clearInterval(timer);
  }, [timeLeft, currentIndex, answers, loading, questions]);

  // 3. Kalkulasi Hasil Akhir (Kriteria G)
  const calculateResult = (finalAnswers = answers) => {
    let correct = 0;
    let incorrect = 0;

    questions.forEach((q, index) => {
      if (finalAnswers[index] === q.correct_answer) {
        correct++;
      } else if (finalAnswers[index] !== undefined) {
        incorrect++;
      }
    });

    onFinish({
      total: questions.length,
      answered: finalAnswers.filter((a) => a !== undefined).length,
      correct,
      incorrect
    });
  };

  // 4. Handle ketika opsi jawaban diklik (Kriteria F)
  const handleAnswer = (selectedOption) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = selectedOption;
    setAnswers(updatedAnswers);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Jika sudah soal terakhir, langsung kalkulasi hasil
      calculateResult(updatedAnswers);
    }
  };

  if (loading) return <div className="text-xl font-semibold text-gray-700">Memuat Soal...</div>;
  if (questions.length === 0) return <div className="text-red-500">Gagal memuat kuis. Coba segarkan halaman.</div>;

  const currentQuestion = questions[currentIndex];

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
      {/* Header Info */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <p className="text-sm text-gray-500">Peserta: <span className="font-semibold text-gray-700">{username}</span></p>
          {/* Kriteria D: Total soal & jumlah dikerjakan */}
          <p className="text-sm text-gray-500">Soal: <span className="font-semibold text-indigo-600">{currentIndex + 1} / {questions.length}</span></p>
        </div>
        {/* Kriteria E: Timer */}
        <div className={`px-4 py-2 rounded-full font-bold text-white ${timeLeft < 15 ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`}>
          ⏱️ {timeLeft}s
        </div>
      </div>

      {/* Area Soal (Kriteria F: Satu halaman satu soal) */}
      <div className="mb-6">
        <h3 
          className="text-lg font-medium text-gray-800 mb-4"
          dangerouslySetInnerHTML={{ __html: currentQuestion.question }} // Mengatasi karakter HTML entities dari API
        />
        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.allOptions.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              className="w-full text-left p-3 border rounded-lg hover:bg-indigo-50, hover:border-indigo-500 hover:bg-indigo-50 transition duration-150"
              dangerouslySetInnerHTML={{ __html: option }}
            />
          ))}
        </div>
      </div>

      {/* Footer Kontrol */}
      <div className="flex justify-between items-center mt-8 pt-4 border-t">
        <button onClick={onLogout} className="text-sm text-red-500 hover:underline">
          Keluar (Reset)
        </button>
        <span className="text-xs text-gray-400">Progress otomatis tersimpan di browser</span>
      </div>
    </div>
  );
}