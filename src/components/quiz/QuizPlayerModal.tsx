import React, { useState, useEffect } from 'react';
import { X, Award, CheckCircle2, XCircle, Timer, Coins, Zap } from 'lucide-react';
import { QuizData } from '../../types';
import { useApp } from '../../context/AppContext';

interface QuizPlayerModalProps {
  quiz: QuizData | null;
  onClose: () => void;
}

export const QuizPlayerModal: React.FC<QuizPlayerModalProps> = ({ quiz, onClose }) => {
  const { submitQuizScore } = useApp();
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(25);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (!quiz || isFinished) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNext(true); // timed out
          return 25;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, currentIdx, isFinished]);

  if (!quiz) return null;

  const currentQ = quiz.questions[currentIdx];

  const handleNext = (timedOut = false) => {
    const isCorrect = !timedOut && selectedOption === currentQ.correctAnswer;
    const nextAnswers = [...answers, isCorrect ? 1 : 0];
    setAnswers(nextAnswers);

    if (currentIdx + 1 < quiz.questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setTimeLeft(25);
    } else {
      setIsFinished(true);
      const correctTotal = nextAnswers.reduce((a, b) => a + b, 0);
      submitQuizScore(quiz, correctTotal, quiz.questions.length);
    }
  };

  const handleOptionClick = (optIdx: number) => {
    if (selectedOption !== null || isFinished) return;
    setSelectedOption(optIdx);

    setTimeout(() => {
      handleNext(false);
    }, 1000);
  };

  const scoreTotal = answers.reduce((a, b) => a + b, 0);
  const earnedXp = Math.round(quiz.xpReward * (scoreTotal / quiz.questions.length));
  const earnedCoins = Math.round(quiz.coinsReward * (scoreTotal / quiz.questions.length));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-violet-500/40 bg-[#0B0F19] p-6 sm:p-8 shadow-[0_0_50px_rgba(139,92,246,0.2)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {!isFinished ? (
          <div>
            {/* Top Stats: Timer & Question number */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-violet-400">
                  {quiz.title}
                </span>
                <h4 className="text-sm font-semibold text-white">
                  Question {currentIdx + 1} / {quiz.questions.length}
                </h4>
              </div>

              {/* Countdown badge */}
              <div
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                  timeLeft <= 5
                    ? 'bg-rose-500/20 text-rose-400 animate-bounce'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                <Timer className="h-3.5 w-3.5" />
                <span>{timeLeft}s</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="my-6 min-h-[60px]">
              <p className="text-base font-medium text-slate-100 leading-snug">
                {currentQ.question}
              </p>
            </div>

            {/* Options grid */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, i) => {
                const isSelected = selectedOption === i;
                const isCorrect = i === currentQ.correctAnswer;

                let stateClasses =
                  'border-slate-800 bg-slate-900/80 text-slate-200 hover:border-violet-500/60 hover:bg-slate-800';

                if (selectedOption !== null) {
                  if (isCorrect) {
                    stateClasses = 'border-emerald-500 bg-emerald-500/20 text-emerald-200';
                  } else if (isSelected) {
                    stateClasses = 'border-rose-500 bg-rose-500/20 text-rose-200';
                  } else {
                    stateClasses = 'border-slate-800/40 opacity-50';
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleOptionClick(i)}
                    disabled={selectedOption !== null}
                    className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left text-sm font-semibold transition-all ${stateClasses}`}
                  >
                    <span>{opt}</span>
                    {selectedOption !== null && isCorrect && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    )}
                    {selectedOption === i && !isCorrect && (
                      <XCircle className="h-5 w-5 text-rose-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation reveal */}
            {selectedOption !== null && currentQ.explanation && (
              <p className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-400">
                💡 {currentQ.explanation}
              </p>
            )}
          </div>
        ) : (
          /* Final Results Screen */
          <div className="text-center py-4">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-[0_0_30px_rgba(139,92,246,0.4)]">
              <Award className="h-10 w-10" />
            </div>

            <h3 className="text-xl font-extrabold text-white">Quiz Terminé !</h3>
            <p className="text-sm text-slate-400 mt-1">
              Vous avez obtenu <span className="text-emerald-400 font-bold">{scoreTotal}</span> sur{' '}
              {quiz.questions.length} bonnes réponses
            </p>

            {/* Rewards Won */}
            <div className="my-6 grid grid-cols-2 gap-3 max-w-xs mx-auto">
              <div className="rounded-2xl border border-violet-500/30 bg-violet-600/10 p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-violet-400 font-bold text-lg">
                  <Zap className="h-5 w-5" />
                  <span>+{earnedXp}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Points d'XP</p>
              </div>

              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-lg">
                  <Coins className="h-5 w-5" />
                  <span>+{earnedCoins}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Pièces gagnées</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg hover:brightness-110 transition-all active:scale-98"
            >
              Fermer et retourner au salon
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
