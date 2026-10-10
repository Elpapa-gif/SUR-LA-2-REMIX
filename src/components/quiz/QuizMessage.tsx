import React, { useState } from 'react';
import { Brain, Play, CheckCircle2, XCircle, Award } from 'lucide-react';
import { QuizData } from '../../types';
import { useApp } from '../../context/AppContext';

interface QuizMessageProps {
  quiz: QuizData;
  onLaunchFullQuiz: () => void;
}

export const QuizMessage: React.FC<QuizMessageProps> = ({ quiz, onLaunchFullQuiz }) => {
  const { submitQuizScore } = useApp();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [hasFinished, setHasFinished] = useState<boolean>(false);

  const currentQ = quiz.questions[currentQuestionIndex];

  const handleSelectOption = (optIndex: number) => {
    if (selectedOption !== null || hasFinished) return;
    setSelectedOption(optIndex);

    const isCorrect = optIndex === currentQ.correctAnswer;
    const newAnswers = [...answers, isCorrect ? 1 : 0];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestionIndex + 1 < quiz.questions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        setHasFinished(true);
        const correctCount = newAnswers.reduce((a, b) => a + b, 0);
        submitQuizScore(quiz, correctCount, quiz.questions.length);
      }
    }, 1200);
  };

  const correctAnswersCount = answers.reduce((a, b) => a + b, 0);

  return (
    <div className="my-2 max-w-md rounded-2xl border border-violet-500/30 bg-slate-900/90 p-4 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
      {/* Quiz Card Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400 ring-1 ring-violet-500/40">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">
              {quiz.title}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span>{quiz.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-cyan-400">+{quiz.xpReward} XP</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400">+{quiz.coinsReward} 🪙</span>
            </div>
          </div>
        </div>

        <button
          onClick={onLaunchFullQuiz}
          className="flex items-center gap-1 rounded-lg bg-slate-800 px-2 py-1 text-[11px] font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          title="Ouvrir en plein écran"
        >
          <Play className="h-3 w-3" />
          <span className="hidden sm:inline">Plein écran</span>
        </button>
      </div>

      {/* Quiz Content Body */}
      {!hasFinished && currentQ ? (
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <span>
              Question {currentQuestionIndex + 1} sur {quiz.questions.length}
            </span>
            <div className="flex gap-1">
              {quiz.questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-4 rounded-full ${
                    i < currentQuestionIndex
                      ? 'bg-emerald-500'
                      : i === currentQuestionIndex
                      ? 'bg-violet-500'
                      : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          <p className="text-xs font-medium text-slate-200 mb-3 leading-relaxed">
            {currentQ.question}
          </p>

          <div className="space-y-1.5">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedOption === optIdx;
              const isCorrectAnswer = optIdx === currentQ.correctAnswer;

              let btnStyle =
                'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80';

              if (selectedOption !== null) {
                if (isCorrectAnswer) {
                  btnStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-200';
                } else if (isSelected && !isCorrectAnswer) {
                  btnStyle = 'border-rose-500 bg-rose-500/20 text-rose-200';
                } else {
                  btnStyle = 'border-slate-800/50 bg-slate-950/40 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={selectedOption !== null}
                  className={`flex w-full items-center justify-between rounded-xl border p-2.5 text-left text-xs font-medium transition-all ${btnStyle}`}
                >
                  <span className="truncate pr-2">{opt}</span>
                  {selectedOption !== null && isCorrectAnswer && (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  )}
                  {selectedOption === optIdx && !isCorrectAnswer && (
                    <XCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && currentQ.explanation && (
            <p className="mt-2.5 rounded-lg bg-slate-950/70 p-2 text-[11px] text-slate-400 border border-slate-800">
              💡 {currentQ.explanation}
            </p>
          )}
        </div>
      ) : (
        /* Finished State */
        <div className="mt-3 text-center py-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg mb-2">
            <Award className="h-6 w-6" />
          </div>
          <h5 className="text-sm font-bold text-white">Quiz complété !</h5>
          <p className="text-xs text-slate-400 mt-0.5">
            Score : <span className="text-emerald-400 font-bold">{correctAnswersCount}</span> /{' '}
            {quiz.questions.length} bonnes réponses
          </p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-xs font-semibold text-emerald-400">
              +{Math.round(quiz.xpReward * (correctAnswersCount / quiz.questions.length))} XP gagnés
            </span>
            <button
              onClick={() => {
                setCurrentQuestionIndex(0);
                setSelectedOption(null);
                setAnswers([]);
                setHasFinished(false);
              }}
              className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              Rejouer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
