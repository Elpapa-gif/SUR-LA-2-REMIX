import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, Play, Users, Zap, Coins, Trophy, Plus } from 'lucide-react';
import { QuizData } from '../../types';
import { useApp } from '../../context/AppContext';
import { supabase, isSupabaseConfigured } from '../../integrations/supabase/client';

interface QuizArenaPageProps {
  onOpenCreateDialog: () => void;
  onLaunchQuiz: (quiz: QuizData) => void;
}

export const QuizArenaPage: React.FC<QuizArenaPageProps> = ({
  onOpenCreateDialog,
  onLaunchQuiz,
}) => {
  const { messages } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dbQuizzes, setDbQuizzes] = useState<QuizData[]>([]);

  // Fetch real quizzes from Supabase
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    supabase
      .from('quizzes')
      .select('*, quiz_questions(*)')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          const loaded: QuizData[] = data.map((q: any) => ({
            id: q.id,
            title: q.title,
            category: q.category,
            description: q.description || 'Quiz créé par la communauté Sur la 2',
            timeLimitSec: q.time_limit_sec || 25,
            xpReward: q.xp_reward || 100,
            coinsReward: q.coins_reward || 40,
            createdBy: q.created_by_name || 'Membre Sur la 2',
            createdAt: new Date(q.created_at).toLocaleDateString(),
            participantsCount: q.participants_count || 0,
            questions: (q.quiz_questions || []).map((qq: any) => ({
              id: qq.id,
              question: qq.question,
              options: qq.options || [],
              correctAnswer: qq.correct_answer,
              explanation: qq.explanation || '',
            })),
          }));
          setDbQuizzes(loaded);
        }
      });
  }, []);

  // Collect quizzes posted in chat messages as well
  const chatQuizzes: QuizData[] = Object.values(messages)
    .flatMap((list) => list.filter((m) => m.type === 'quiz' && m.quizData).map((m) => m.quizData!));

  // Merge unique quizzes by ID
  const allQuizzesMap = new Map<string, QuizData>();
  dbQuizzes.forEach((q) => allQuizzesMap.set(q.id, q));
  chatQuizzes.forEach((q) => allQuizzesMap.set(q.id, q));
  const allQuizzes = Array.from(allQuizzesMap.values());

  const filteredQuizzes = allQuizzes.filter((q) =>
    selectedCategory === 'all' ? true : q.category.toLowerCase().includes(selectedCategory.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] overflow-y-auto bg-[#0B0F19] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-900/30 via-indigo-900/30 to-amber-900/10 p-6 sm:p-8 shadow-xl backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400">
                <Trophy className="h-3.5 w-3.5" />
                <span>Arène Officielle</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Arène Quizz Sur la 2 🧠
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Mesurez vos connaissances face à vos amis, grimpez dans le classement et gagnez de l'XP en répondant aux quizz créés par la communauté ou générés par l'IA Gemini.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenCreateDialog}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 px-4 py-3 text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Générer un Quiz avec l'IA</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800">
          {[
            { key: 'all', label: 'Tous les Quiz' },
            { key: 'Pop Culture', label: 'Pop Culture' },
            { key: 'Gaming', label: 'Gaming' },
            { key: 'Tech', label: 'Tech & Code' },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
                selectedCategory === cat.key
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Quizzes Grid or Empty State */}
        {filteredQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-[#0B0F19]/90 p-6 shadow-xl transition-all hover:border-violet-500/40 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-slate-300">
                      {quiz.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Users className="h-3.5 w-3.5" />
                      <span>{quiz.participantsCount} participants</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors mb-2">
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {quiz.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs font-semibold mb-5">
                    <span className="flex items-center gap-1 text-violet-400">
                      <Zap className="h-3.5 w-3.5" />
                      +{quiz.xpReward} XP
                    </span>
                    <span aria-hidden="true" className="text-slate-700">·</span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <Coins className="h-3.5 w-3.5" />
                      +{quiz.coinsReward} 🪙
                    </span>
                    <span aria-hidden="true" className="text-slate-700">·</span>
                    <span className="text-slate-400">
                      {quiz.questions.length} questions
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Par {quiz.createdBy}
                  </span>

                  <button
                    onClick={() => onLaunchQuiz(quiz)}
                    className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-violet-500 active:scale-95 transition-all"
                  >
                    <Play className="h-3.5 w-3.5 fill-white" />
                    <span>Jouer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-800 bg-[#0B0F19]/90 p-12 text-center max-w-lg mx-auto shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600/20 text-violet-400 ring-1 ring-violet-500/30">
              <Brain className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              Aucun quiz dans l'arène pour l'instant
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              La base de données est prête et propre ! Soyez le premier à générer un quiz avec l'IA Gemini ou à en créer un manuellement.
            </p>
            <button
              onClick={onOpenCreateDialog}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Créer le Premier Quiz</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
