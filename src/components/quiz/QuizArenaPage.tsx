import React, { useState } from 'react';
import { Brain, Sparkles, Play, Plus, Zap, Coins, Users, Trophy } from 'lucide-react';
import { QuizData } from '../../types';
import { useApp } from '../../context/AppContext';

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

  // Extract quizzes posted in chats or default quizzes
  const allQuizzes: QuizData[] = [
    {
      id: 'quiz_pop_cult',
      title: 'Duel Pop Culture & Mèmes',
      category: 'Pop Culture',
      description: 'Le quiz ultime sur les répliques cultes, les mèmes d\'Internet et les tendances.',
      questions: [
        {
          id: 'q1',
          question: 'Quel est le prénom du chat gourmand et paresseux créé par Jim Davis ?',
          options: ['Felix', 'Garfield', 'Tom', 'Sylvestre'],
          correctAnswer: 1,
          explanation: 'Garfield, grand amateur de lasagnes et haineux des lundis !',
        },
        {
          id: 'q2',
          question: 'Dans Harry Potter, quel est le numéro du quai magique de la gare de King\'s Cross ?',
          options: ['9', '9 ¾', '7 ½', '11 ¾'],
          correctAnswer: 1,
          explanation: 'La voie 9 ¾ entre la voie 9 et 10 !',
        },
        {
          id: 'q3',
          question: 'Qui chante le tube planétaire "Blinding Lights" ?',
          options: ['Drake', 'The Weeknd', 'Bruno Mars', 'Ed Sheeran'],
          correctAnswer: 1,
          explanation: 'The Weeknd sur son album After Hours (2020).',
        },
      ],
      timeLimitSec: 25,
      xpReward: 120,
      coinsReward: 50,
      createdBy: 'Camille V.',
      createdAt: 'Aujourd\'hui',
      participantsCount: 18,
    },
    {
      id: 'quiz_gaming_retro',
      title: 'Gaming & Histoire du Jeu Vidéo',
      category: 'Gaming',
      description: 'De Mario à Minecraft, testez vos réflexes et votre mémoire de gamer.',
      questions: [
        {
          id: 'q_g1',
          question: 'Quel est le nom de la princesse dans la saga The Legend of Zelda ?',
          options: ['Peach', 'Zelda', 'Samus', 'Midona'],
          correctAnswer: 1,
          explanation: 'Zelda est la princesse du royaume d\'Hyrule, tandis que Link est le héros.',
        },
        {
          id: 'q_g2',
          question: 'Quel jeu a popularisé le mode Battle Royale en 2017 ?',
          options: ['Fortnite', 'PUBG', 'Apex Legends', 'Warzone'],
          correctAnswer: 1,
          explanation: 'PlayerUnknown\'s Battlegrounds (PUBG) a déclenché le raz-de-marée.',
        },
        {
          id: 'q_g3',
          question: 'Quelle est la console la plus vendue de tous les temps ?',
          options: ['Nintendo Switch', 'PlayStation 2', 'Nintendo DS', 'PlayStation 4'],
          correctAnswer: 1,
          explanation: 'La PlayStation 2 avec plus de 155 millions d\'unités vendues.',
        },
      ],
      timeLimitSec: 25,
      xpReward: 140,
      coinsReward: 60,
      createdBy: 'Thomas B.',
      createdAt: 'Hier',
      participantsCount: 24,
    },
    {
      id: 'quiz_tech_code',
      title: 'Tech, Web & Découvertes',
      category: 'Tech',
      description: 'Algorithmes, géants de la tech et anecdotes surprenantes du web.',
      questions: [
        {
          id: 'q_t1',
          question: 'En quelle année a été envoyé le tout premier SMS de l\'histoire ?',
          options: ['1988', '1992', '1996', '2000'],
          correctAnswer: 1,
          explanation: 'Le 3 décembre 1992 ("Merry Christmas") par Neil Papworth.',
        },
        {
          id: 'q_t2',
          question: 'Que signifie l\'acronyme "HTML" ?',
          options: [
            'HyperText Markup Language',
            'High Tech Machine Learning',
            'Home Tool Markup Line',
            'Hyper Terminal Main Loop',
          ],
          correctAnswer: 0,
          explanation: 'HyperText Markup Language, langage standard de structure du web.',
        },
      ],
      timeLimitSec: 20,
      xpReward: 90,
      coinsReward: 40,
      createdBy: 'Sur la 2 Bot',
      createdAt: 'Cette semaine',
      participantsCount: 31,
    },
  ];

  const filteredQuizzes = allQuizzes.filter((q) =>
    selectedCategory === 'all' ? true : q.category.toLowerCase() === selectedCategory.toLowerCase()
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

        {/* Quizzes Grid */}
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
      </div>
    </div>
  );
};
