import { GoogleGenAI } from '@google/genai';
import { QuizData, QuizQuestion } from '../types';

// Safe initialization
const getApiKey = (): string | undefined => {
  return (
    (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
    undefined
  );
};

export async function generateAiQuiz(topic: string, questionCount: number = 3): Promise<QuizData> {
  const apiKey = getApiKey();

  // If no API key or in fallback mode, return a curated, high quality quiz
  if (!apiKey) {
    return generateLocalFallbackQuiz(topic);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Génère un quiz interactif en français sur le thème "${topic}".
Le quiz doit comporter exactement ${questionCount} questions amusantes, engageantes et adaptées à une communauté d'amis et d'étudiants ("Sur la 2").
Format de sortie JSON STRICT:
{
  "title": "Titre du Quiz percutant",
  "description": "Courte description captivante",
  "category": "${topic}",
  "questions": [
    {
      "question": "Texte de la question ?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explication courte et amusante."
    }
  ]
}
Assure-toi que "correctAnswer" est un index numérique valide (0, 1, 2 ou 3) correspondant à la bonne réponse dans le tableau options.
Ne renvoie rien d'autre que du JSON pur.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '';
    const parsed = JSON.parse(text);

    const questions: QuizQuestion[] = (parsed.questions || []).map((q: any, i: number) => ({
      id: `q_ai_${Date.now()}_${i}`,
      question: q.question,
      options: q.options || ['Vrai', 'Faux', 'Peut-être', 'Aucune idée'],
      correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
      explanation: q.explanation || '',
    }));

    return {
      id: `quiz_ai_${Date.now()}`,
      title: parsed.title || `Quiz : ${topic}`,
      category: parsed.category || topic,
      description: parsed.description || `Quiz généré par l'IA sur ${topic}`,
      questions,
      timeLimitSec: 25,
      xpReward: questions.length * 35,
      coinsReward: questions.length * 15,
      createdBy: 'Sur la 2 Bot IA',
      createdAt: new Date().toISOString(),
      participantsCount: 0,
    };
  } catch (error) {
    console.warn('Gemini API call fell back to local curated quiz:', error);
    return generateLocalFallbackQuiz(topic);
  }
}

export async function generateIcebreakerTopic(): Promise<string> {
  const apiKey = getApiKey();
  const fallbackIcebreakers = [
    "🔥 Dilemme du jour : Vous préférez pouvoir voyager 100 ans dans le futur ou 100 ans dans le passé ?",
    "☕ Quelle est la boisson indispensable qui vous sauve la vie en ce moment ?",
    "🎵 Si vous deviez écouter une seule musique pour le reste de la semaine, ce serait quoi ?",
    "🎮 Quel est le jeu vidéo ou la série qui vous a le plus marqué récemment ?",
    "🍕 La règle ultime : avec ou sans ananas sur la pizza ?",
  ];

  if (!apiKey) {
    return fallbackIcebreakers[Math.floor(Math.random() * fallbackIcebreakers.length)];
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents:
        'Propose une question brise-glace ou un dilemme amusant en français en 1 phrase courte pour relancer un salon de chat entre potes. Reste spontané, chaleureux et engageant.',
    });
    return response.text?.trim() || fallbackIcebreakers[0];
  } catch {
    return fallbackIcebreakers[Math.floor(Math.random() * fallbackIcebreakers.length)];
  }
}

function generateLocalFallbackQuiz(topic: string): QuizData {
  const curatedBank: Record<string, { title: string; questions: QuizQuestion[] }> = {
    'Culture Pop': {
      title: 'Pop Culture & Mèmes',
      questions: [
        {
          id: 'cp_1',
          question: 'Dans quelle série retrouve-t-on le fameux "Café Central Perk" ?',
          options: ['Friends', 'How I Met Your Mother', 'The Big Bang Theory', 'Brooklyn Nine-Nine'],
          correctAnswer: 0,
          explanation: 'Le Central Perk est le QG légendaire de la bande de Friends !',
        },
        {
          id: 'cp_2',
          question: 'Quel est le prénom du protagoniste principal dans "One Piece" ?',
          options: ['Zoro', 'Luffy', 'Sanji', 'Shanks'],
          correctAnswer: 1,
          explanation: 'Monkey D. Luffy, futur roi des pirates !',
        },
        {
          id: 'cp_3',
          question: 'Quelle est la devise de la maison Stark dans Game of Thrones ?',
          options: ['Hear Me Roar', 'Winter is Coming', 'Fire and Blood', 'Growing Strong'],
          correctAnswer: 1,
          explanation: '"Winter is Coming" (L\'hiver vient) est la devise ancestrale des Stark.',
        },
      ],
    },
    'Tech & Gaming': {
      title: 'Gaming & High-Tech',
      questions: [
        {
          id: 'tg_1',
          question: 'En quelle année la toute première PlayStation (PS1) est-elle sortie au Japon ?',
          options: ['1992', '1994', '1996', '1998'],
          correctAnswer: 1,
          explanation: 'Sortie en décembre 1994 au Japon, un tournant historique pour le gaming !',
        },
        {
          id: 'tg_2',
          question: 'Quel langage de programmation a été créé par Brendan Eich en seulement 10 jours ?',
          options: ['Python', 'JavaScript', 'Ruby', 'PHP'],
          correctAnswer: 1,
          explanation: 'JavaScript a été conçu en mai 1995 pour Netscape Navigator en 10 jours chrono.',
        },
        {
          id: 'tg_3',
          question: 'Dans Minecraft, quel minerai est le plus résistant depuis la version 1.16 ?',
          options: ['Diamant', 'Netherite', 'Émeraude', 'Obsidienne'],
          correctAnswer: 1,
          explanation: 'La Netherite surpasse le diamant en durabilité et résiste à la lave.',
        },
      ],
    },
  };

  const key = Object.keys(curatedBank).find((k) =>
    topic.toLowerCase().includes(k.toLowerCase())
  ) || 'Culture Pop';

  const data = curatedBank[key] || curatedBank['Culture Pop'];

  return {
    id: `quiz_fallback_${Date.now()}`,
    title: `Quiz : ${topic.length > 2 ? topic : data.title}`,
    category: topic,
    description: `Défiez vos amis sur le salon "Sur la 2" !`,
    questions: data.questions,
    timeLimitSec: 25,
    xpReward: 100,
    coinsReward: 40,
    createdBy: 'Sur la 2 Bot',
    createdAt: new Date().toISOString(),
    participantsCount: 0,
  };
}
