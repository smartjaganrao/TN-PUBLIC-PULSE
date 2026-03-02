import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Share2, 
  RefreshCw, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Award,
  Zap,
  Target,
  MessageCircle,
  Twitter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "How many assembly constituencies are there in Tamil Nadu?",
    options: ["232", "234", "235", "240"],
    correctAnswer: 1,
    explanation: "Tamil Nadu has 234 assembly constituencies. A party needs 118 seats for a simple majority."
  },
  {
    id: 2,
    question: "Which political leader is fondly known as 'Kalaignar'?",
    options: ["M.G. Ramachandran", "C.N. Annadurai", "M. Karunanidhi", "K. Kamaraj"],
    correctAnswer: 2,
    explanation: "M. Karunanidhi was called 'Kalaignar' (Artist) for his contributions to Tamil literature and cinema."
  },
  {
    id: 3,
    question: "In which year did the DMK first come to power in Tamil Nadu?",
    options: ["1962", "1967", "1971", "1977"],
    correctAnswer: 1,
    explanation: "DMK first came to power in 1967 under the leadership of C.N. Annadurai."
  },
  {
    id: 4,
    question: "Who founded the AIADMK party in 1972?",
    options: ["J. Jayalalithaa", "M.G. Ramachandran", "O. Panneerselvam", "Edappadi K. Palaniswami"],
    correctAnswer: 1,
    explanation: "M.G. Ramachandran (MGR) founded the AIADMK after breaking away from the DMK."
  },
  {
    id: 5,
    question: "Which leader is known as 'Perunthalaivar'?",
    options: ["K. Kamaraj", "C. Rajagopalachari", "E.V. Ramasamy", "M.K. Stalin"],
    correctAnswer: 0,
    explanation: "K. Kamaraj is known as 'Perunthalaivar' (The Great Leader) and 'Kingmaker' of Indian politics."
  },
  {
    id: 6,
    question: "What is the election symbol of the DMK party?",
    options: ["Two Leaves", "Rising Sun", "Hand", "Lotus"],
    correctAnswer: 1,
    explanation: "The 'Rising Sun' has been the iconic symbol of the DMK for decades."
  },
  {
    id: 7,
    question: "Which movement was started by E.V. Ramasamy (Periyar)?",
    options: ["Quit India Movement", "Self-Respect Movement", "Bhoodan Movement", "Dravida Nadu Movement"],
    correctAnswer: 1,
    explanation: "Periyar started the Self-Respect Movement in 1925 to promote social equality."
  },
  {
    id: 8,
    question: "Who was the first Chief Minister of Madras State (now Tamil Nadu) from the DMK?",
    options: ["M. Karunanidhi", "C.N. Annadurai", "V.R. Nedunchezhiyan", "K. Anbazhagan"],
    correctAnswer: 1,
    explanation: "C.N. Annadurai became the first DMK Chief Minister in 1967."
  },
  {
    id: 9,
    question: "What is the election symbol of the AIADMK party?",
    options: ["Rising Sun", "Two Leaves", "Bicycle", "Clock"],
    correctAnswer: 1,
    explanation: "The 'Two Leaves' symbol was popularized by MGR and later J. Jayalalithaa."
  },
  {
    id: 10,
    question: "When is the next Tamil Nadu Legislative Assembly election expected?",
    options: ["2024", "2025", "2026", "2027"],
    correctAnswer: 2,
    explanation: "The next assembly election in Tamil Nadu is scheduled for 2026."
  }
];

const GamePage: React.FC = () => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && !isAnswered && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswer(-1); // Time out
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState, isAnswered]);

  const startGame = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(15);
  };

  const handleAnswer = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    if (optionIndex === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(15);
    } else {
      setGameState('finished');
      if (score >= 7) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const getRank = () => {
    if (score === 10) return { title: "Political Strategist", color: "text-emerald-500", icon: <Award size={48} /> };
    if (score >= 7) return { title: "Policy Expert", color: "text-blue-500", icon: <Target size={48} /> };
    if (score >= 4) return { title: "Active Citizen", color: "text-amber-500", icon: <Zap size={48} /> };
    return { title: "Grassroots Observer", color: "text-zinc-500", icon: <RefreshCw size={48} /> };
  };

  const shareScore = () => {
    const rank = getRank();
    const text = `I scored ${score}/10 in the TN Political IQ Quiz and earned the rank of ${rank.title}! Can you beat me? 🗳️🔥 #TNPulse2026 #TamilNadu`;
    const url = window.location.origin + '/game';
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {gameState === 'start' && (
            <motion.div 
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[3rem] p-10 sm:p-16 text-center shadow-2xl space-y-10 border border-[#141414]/5"
            >
              <div className="w-24 h-24 bg-[#046A38] rounded-[2rem] flex items-center justify-center mx-auto text-white shadow-xl shadow-emerald-100">
                <Target size={48} />
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl font-black text-zinc-900 font-display tracking-tighter leading-none">
                  Political <span className="text-[#046A38]">IQ Quiz</span>
                </h1>
                <p className="text-zinc-500 text-lg font-medium max-w-md mx-auto">
                  Test your knowledge of Tamil Nadu's political history and current affairs. Earn your rank and share it with the community!
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <p className="text-2xl font-black text-zinc-900">10</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Questions</p>
                </div>
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <p className="text-2xl font-black text-zinc-900">15s</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Per Qn</p>
                </div>
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <p className="text-2xl font-black text-zinc-900">Rank</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Rewards</p>
                </div>
              </div>
              <button 
                onClick={startGame}
                className="w-full bg-zinc-900 text-white py-6 rounded-full font-black text-xl shadow-2xl hover:bg-zinc-800 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                Start Challenge
                <ChevronRight size={24} />
              </button>
              <Link to="/" className="block text-zinc-400 font-black text-[10px] uppercase tracking-widest hover:text-zinc-900 transition-colors">
                Back to Home
              </Link>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div 
              key="playing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Progress Header */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center font-black text-zinc-900 shadow-sm border border-zinc-100">
                    {currentQuestionIndex + 1}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Question</p>
                    <p className="text-sm font-black text-zinc-900">of {questions.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center font-black shadow-sm border border-zinc-100 transition-colors ${timeLeft <= 5 ? 'text-rose-500 border-rose-100' : 'text-zinc-900'}`}>
                    {timeLeft}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Time Left</p>
                    <p className="text-sm font-black text-zinc-900">Seconds</p>
                  </div>
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-white rounded-[3rem] p-8 sm:p-12 shadow-2xl border border-[#141414]/5 space-y-10">
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 font-display leading-tight">
                  {questions[currentQuestionIndex].question}
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  {questions[currentQuestionIndex].options.map((option, idx) => {
                    const isCorrect = idx === questions[currentQuestionIndex].correctAnswer;
                    const isSelected = idx === selectedOption;
                    
                    let buttonClass = "bg-zinc-50 border-zinc-100 text-zinc-700 hover:bg-zinc-100";
                    if (isAnswered) {
                      if (isCorrect) buttonClass = "bg-emerald-50 border-emerald-200 text-emerald-700 ring-2 ring-emerald-500/20";
                      else if (isSelected) buttonClass = "bg-rose-50 border-rose-200 text-rose-700 ring-2 ring-rose-500/20";
                      else buttonClass = "bg-zinc-50 border-zinc-100 text-zinc-300 opacity-50";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        disabled={isAnswered}
                        className={`w-full p-6 rounded-2xl border-2 text-left font-black text-lg transition-all flex items-center justify-between group ${buttonClass}`}
                      >
                        <span>{option}</span>
                        {isAnswered && isCorrect && <CheckCircle2 size={24} className="text-emerald-500" />}
                        {isAnswered && isSelected && !isCorrect && <XCircle size={24} className="text-rose-500" />}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-8 border-t border-zinc-100 space-y-6"
                    >
                      <div className="bg-zinc-50 p-6 rounded-2xl">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Did you know?</p>
                        <p className="text-zinc-600 font-medium leading-relaxed">
                          {questions[currentQuestionIndex].explanation}
                        </p>
                      </div>
                      <button
                        onClick={nextQuestion}
                        className="w-full bg-[#046A38] text-white py-5 rounded-full font-black text-lg shadow-xl hover:bg-[#03552d] transition-all flex items-center justify-center gap-3"
                      >
                        {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                        <ChevronRight size={20} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {gameState === 'finished' && (
            <motion.div 
              key="finished"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[4rem] p-10 sm:p-16 text-center shadow-2xl space-y-12 border border-[#141414]/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                <Trophy size={200} />
              </div>

              <div className="space-y-6 relative z-10">
                <div className={`w-24 h-24 bg-zinc-50 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner mb-8 ${getRank().color}`}>
                  {getRank().icon}
                </div>
                <h2 className="text-4xl font-black text-zinc-400 uppercase tracking-[0.3em] font-display">Quiz Complete</h2>
                <div className="space-y-2">
                  <p className="text-8xl font-black text-zinc-900 tracking-tighter font-display leading-none">{score}<span className="text-zinc-300">/10</span></p>
                  <p className={`text-2xl font-black uppercase tracking-widest ${getRank().color}`}>{getRank().title}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                <button
                  onClick={shareScore}
                  className="bg-[#25D366] text-white py-5 rounded-full font-black text-lg flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-green-100"
                >
                  <MessageCircle size={24} />
                  Share on WhatsApp
                </button>
                <button
                  onClick={startGame}
                  className="bg-zinc-900 text-white py-5 rounded-full font-black text-lg flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-100"
                >
                  <RefreshCw size={24} />
                  Try Again
                </button>
              </div>

              <div className="pt-8 border-t border-zinc-100 flex flex-col items-center gap-6 relative z-10">
                <p className="text-zinc-400 font-black text-[10px] uppercase tracking-widest">More for you</p>
                <div className="flex items-center gap-8">
                  <Link to="/vote" className="text-zinc-900 font-black text-xs uppercase tracking-widest hover:text-[#046A38] transition-colors">Cast Vote</Link>
                  <div className="w-1.5 h-1.5 bg-zinc-200 rounded-full" />
                  <Link to="/results" className="text-zinc-900 font-black text-xs uppercase tracking-widest hover:text-[#046A38] transition-colors">View Trends</Link>
                  <div className="w-1.5 h-1.5 bg-zinc-200 rounded-full" />
                  <Link to="/forum" className="text-zinc-900 font-black text-xs uppercase tracking-widest hover:text-[#046A38] transition-colors">Join Forum</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GamePage;
