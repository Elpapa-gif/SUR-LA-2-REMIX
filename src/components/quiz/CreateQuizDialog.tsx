import React, { useState } from 'react';
import { X, Sparkles, Brain, Plus, Trash2, Loader2, Check } from 'lucide-react';
import { QuizData, QuizQuestion } from '../../types';
import { generateAiQuiz } from '../../services/gemini';
import { useApp } from '../../context/AppContext';

interface CreateQuizDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_TOPICS = [
  'Culture Pop & Mèmes',
  'Gaming & High-Tech',
  'Cinéma & Séries',
  'Musique & Hip-Hop',
  'Science & Découvertes',
  'Délires & Anecdotes',
];

export const CreateQuizDialog: React.FC<CreateQuizDialogProps> = ({ isOpen, onClose }) => {
  const { createQuiz } = useApp();
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');
  const [topic, setTopic] = useState<string>('Culture Pop & Mèmes');
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Manual fields
  const [manualTitle, setManualTitle] = useState<string>('');
  const [manualCategory, setManualCategory] = useState<string>('Divers');
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q_1',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
    },
  ]);

  if (!isOpen) return null;

  const handleGenerateAi = async () => {
    setIsGenerating(true);
    try {
      const generated = await generateAiQuiz(topic, questionCount);
      createQuiz(generated, true);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: `q_${Date.now()}`,
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
      },
    ]);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim() || questions.some((q) => !q.question.trim())) return;

    const newQuiz: QuizData = {
      id: `quiz_user_${Date.now()}`,
      title: manualTitle.trim(),
      category: manualCategory.trim(),
      description: `Quiz créé par la communauté Sur la 2`,
      questions,
      timeLimitSec: 30,
      xpReward: questions.length * 35,
      coinsReward: questions.length * 15,
      createdBy: 'Moi',
      createdAt: new Date().toISOString(),
      participantsCount: 0,
    };

    createQuiz(newQuiz, true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-[#0B0F19] p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400 ring-1 ring-violet-500/40">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Créer un Quiz pour le salon
            </h3>
            <p className="text-xs text-slate-400">
              Défiez les membres et gagnez des points d'XP et des pièces !
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="mb-5 flex rounded-xl bg-slate-900 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setMode('ai')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-colors ${
              mode === 'ai'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Générateur IA Gemini</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('manual')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-colors ${
              mode === 'manual'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Création Manuelle</span>
          </button>
        </div>

        {/* AI Generator Mode */}
        {mode === 'ai' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Thématique du Quiz
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Séries des années 2000, Manga, Jeux vidéo..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-violet-500 focus:outline-none"
              />
            </div>

            {/* Popular Topics suggestions */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                Suggestions populaires :
              </label>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopic(t)}
                    className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      topic === t
                        ? 'border-violet-500 bg-violet-500/20 text-violet-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Question count */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Nombre de questions ({questionCount})
              </label>
              <div className="flex gap-2">
                {[3, 4, 5].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={`flex-1 rounded-xl border py-2 text-xs font-semibold transition-colors ${
                      questionCount === count
                        ? 'border-violet-500 bg-violet-600/20 text-white'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {count} questions
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerateAi}
                disabled={isGenerating || !topic.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 py-3 text-xs font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-98 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Génération par Gemini en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Générer et publier dans le salon</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Manual Mode */
          <form onSubmit={handleManualSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Titre du Quiz
              </label>
              <input
                type="text"
                required
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                placeholder="Ex: Le Quiz Ultime de la 2"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-violet-500 focus:outline-none"
              />
            </div>

            {/* Questions list */}
            {questions.map((q, qIndex) => (
              <div key={q.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">
                    Question {qIndex + 1}
                  </span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setQuestions((prev) => prev.filter((_, i) => i !== qIndex))}
                      className="text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  required
                  value={q.question}
                  onChange={(e) =>
                    setQuestions((prev) =>
                      prev.map((item, i) =>
                        i === qIndex ? { ...item, question: e.target.value } : item
                      )
                    )
                  }
                  placeholder="Intitulé de la question..."
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                />

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name={`correct_${qIndex}`}
                        checked={q.correctAnswer === optIndex}
                        onChange={() =>
                          setQuestions((prev) =>
                            prev.map((item, i) =>
                              i === qIndex ? { ...item, correctAnswer: optIndex } : item
                            )
                          )
                        }
                        className="accent-violet-500"
                      />
                      <input
                        type="text"
                        required
                        value={opt}
                        onChange={(e) =>
                          setQuestions((prev) =>
                            prev.map((item, i) =>
                              i === qIndex
                                ? {
                                    ...item,
                                    options: item.options.map((o, oi) =>
                                      oi === optIndex ? e.target.value : o
                                    ),
                                  }
                                : item
                            )
                          )
                        }
                        placeholder={`Option ${optIndex + 1}`}
                        className="flex-1 rounded-md border border-slate-800 bg-slate-950 px-2 py-1 text-[11px] text-slate-200 placeholder-slate-600 focus:border-violet-500 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddQuestion}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-800 py-2 text-xs font-medium text-slate-400 hover:border-slate-700 hover:text-white"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Ajouter une question</span>
            </button>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-violet-500"
            >
              <Check className="h-4 w-4" />
              <span>Publier le Quiz</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
