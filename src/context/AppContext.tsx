import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  ChatMessage,
  Conversation,
  QuizData,
  MarketplaceItem,
  AdminBroadcastNotification,
  SystemAuditLog,
  MoodType,
  UserMood,
} from '../types';
import { soundManager } from '../utils/audio';

export const MOOD_DEFINITIONS: Record<MoodType, { label: string; emoji: string; color: string }> = {
  energetic: { label: 'En pleine forme', emoji: '⚡', color: '#10B981' },
  chill: { label: 'Mode détente', emoji: '☕', color: '#38BDF8' },
  focused: { label: 'En plein focus', emoji: '🎯', color: '#8B5CF6' },
  stressed: { label: 'Sous l\'eau', emoji: '🌊', color: '#F43F5E' },
  party: { label: 'Ambiance fête', emoji: '🎉', color: '#F59E0B' },
  creative: { label: 'Inspiration max', emoji: '🎨', color: '#EC4899' },
};

export const INITIAL_USER: UserProfile = {
  id: 'user_me',
  username: 'alex_2',
  displayName: 'Alexandre L.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'admin',
  title: 'Pionnier de la 2',
  mood: {
    type: 'energetic',
    emoji: '⚡',
    label: 'En pleine forme',
    color: '#10B981',
    customStatus: 'Prêt pour les quizz du jour !',
    updatedAt: new Date().toISOString(),
  },
  streakDays: 7,
  lastActive: new Date().toISOString(),
  xp: 1420,
  level: 4,
  coins: 380,
  equippedBadge: 'badge_flame',
  badges: ['badge_founder', 'badge_flame', 'badge_quiz_master'],
  bio: 'Toujours sur la 2 pour tester les nouveaux quizz et discuter.',
};

export const INITIAL_FRIENDS: UserProfile[] = [
  {
    id: 'friend_camille',
    username: 'camille_v',
    displayName: 'Camille V.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'moderator',
    title: 'Quiz Master',
    mood: {
      type: 'focused',
      emoji: '🎯',
      label: 'En plein focus',
      color: '#8B5CF6',
      customStatus: 'Révise pour les partiels 📚',
      updatedAt: 'Il y a 10m',
    },
    streakDays: 14,
    lastActive: 'En ligne',
    xp: 2890,
    level: 6,
    coins: 720,
    equippedBadge: 'badge_quiz_master',
    badges: ['badge_quiz_master', 'badge_flame'],
  },
  {
    id: 'friend_thomas',
    username: 'thomas_b',
    displayName: 'Thomas B.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'member',
    title: 'Membre Assidu',
    mood: {
      type: 'chill',
      emoji: '☕',
      label: 'Mode détente',
      color: '#38BDF8',
      customStatus: 'Pause café bien méritée',
      updatedAt: 'Il y a 25m',
    },
    streakDays: 5,
    lastActive: 'Il y a 5m',
    xp: 940,
    level: 3,
    coins: 210,
    equippedBadge: 'badge_chill',
    badges: ['badge_chill'],
  },
  {
    id: 'friend_sarah',
    username: 'sarah_k',
    displayName: 'Sarah K.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'member',
    title: 'Challenger',
    mood: {
      type: 'party',
      emoji: '🎉',
      label: 'Ambiance fête',
      color: '#F59E0B',
      customStatus: 'Week-end en approche !',
      updatedAt: 'Il y a 1h',
    },
    streakDays: 9,
    lastActive: 'Il y a 18m',
    xp: 1850,
    level: 5,
    coins: 460,
    equippedBadge: 'badge_star',
    badges: ['badge_star', 'badge_flame'],
  },
  {
    id: 'friend_hugo',
    username: 'hugo_m',
    displayName: 'Hugo M.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'member',
    title: 'Créateur de contenu',
    mood: {
      type: 'creative',
      emoji: '🎨',
      label: 'Inspiration max',
      color: '#EC4899',
      customStatus: 'Nouveau concept en préparation',
      updatedAt: 'Il y a 2h',
    },
    streakDays: 3,
    lastActive: 'Il y a 42m',
    xp: 720,
    level: 2,
    coins: 150,
    equippedBadge: 'badge_creative',
    badges: ['badge_creative'],
  },
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'channel_general',
    name: 'général - Sur la 2',
    type: 'channel',
    topic: 'Le salon central de la communauté : actus, discussions et bonne humeur !',
    avatar: '⚡',
    isPinned: true,
    unreadCount: 0,
    lastMessage: {
      content: 'Bienvenue sur la toute nouvelle version de Sur la 2 ! 🚀',
      timestamp: '11:45',
      senderName: 'Alexandre L.',
    },
    members: ['user_me', 'friend_camille', 'friend_thomas', 'friend_sarah', 'friend_hugo'],
    category: 'salons',
  },
  {
    id: 'channel_quizz',
    name: 'le-lab-quizz',
    type: 'channel',
    topic: 'Défis en direct, duels de culture générale et quiz générés par l\'IA 🧠',
    avatar: '🧠',
    isPinned: true,
    unreadCount: 2,
    lastMessage: {
      content: 'Nouveau quiz Culture Pop disponible, qui relève le défi ?',
      timestamp: '11:42',
      senderName: 'Camille V.',
    },
    members: ['user_me', 'friend_camille', 'friend_thomas', 'friend_sarah'],
    category: 'salons',
  },
  {
    id: 'channel_moods',
    name: 'humeurs-du-jour',
    type: 'channel',
    topic: 'Partagez votre météo émotionnelle quotidienne sans filtre ☀️🌦️',
    avatar: '🎭',
    unreadCount: 0,
    lastMessage: {
      content: 'Sarah K. a mis à jour son humeur : 🎉 Ambiance fête',
      timestamp: '10:30',
      senderName: 'Système',
    },
    members: ['user_me', 'friend_camille', 'friend_thomas', 'friend_sarah', 'friend_hugo'],
    category: 'salons',
  },
  {
    id: 'direct_camille',
    name: 'Camille V.',
    type: 'direct',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    unreadCount: 1,
    lastMessage: {
      content: 'Tu as vu le nouveau classement de la semaine ? 🔥',
      timestamp: '11:15',
      senderName: 'Camille V.',
    },
    members: ['user_me', 'friend_camille'],
    category: 'directs',
  },
  {
    id: 'direct_thomas',
    name: 'Thomas B.',
    type: 'direct',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    unreadCount: 0,
    lastMessage: {
      content: 'On se prend une pause d\'ici 15 minutes ?',
      timestamp: '09:50',
      senderName: 'Thomas B.',
    },
    members: ['user_me', 'friend_thomas'],
    category: 'directs',
  },
];

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  channel_general: [
    {
      id: 'msg_1',
      conversationId: 'channel_general',
      senderId: 'friend_thomas',
      senderName: 'Thomas B.',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      content: 'Salut l\'équipe ! Comment se passe votre journée ?',
      timestamp: '11:30',
      type: 'text',
      reactions: [
        { emoji: '👋', count: 3, users: ['user_me', 'friend_camille', 'friend_sarah'] },
        { emoji: '☕', count: 2, users: ['friend_thomas', 'user_me'] },
      ],
    },
    {
      id: 'msg_2',
      conversationId: 'channel_general',
      senderId: 'friend_camille',
      senderName: 'Camille V.',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      senderRole: 'moderator',
      content: 'Très bien ! On teste les nouvelles interactions néon et le tracker d\'humeur en direct.',
      timestamp: '11:34',
      type: 'text',
      reactions: [{ emoji: '🚀', count: 4, users: ['user_me', 'friend_thomas', 'friend_sarah', 'friend_hugo'] }],
    },
    {
      id: 'msg_3',
      conversationId: 'channel_general',
      senderId: 'user_me',
      senderName: 'Alexandre L.',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      senderRole: 'admin',
      content: 'Bienvenue sur la toute nouvelle version de Sur la 2 ! 🚀 Tout est synchronisé en temps réel avec système de points et de quizz.',
      timestamp: '11:45',
      type: 'text',
      reactions: [{ emoji: '💜', count: 5, users: ['friend_camille', 'friend_thomas', 'friend_sarah', 'friend_hugo', 'user_me'] }],
    },
  ],
  channel_quizz: [
    {
      id: 'msg_quiz_1',
      conversationId: 'channel_quizz',
      senderId: 'friend_camille',
      senderName: 'Camille V.',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      content: 'J\'ai lancé un mini quiz rapide sur les séries cultes ! Cliquez directement ci-dessous pour répondre :',
      timestamp: '11:40',
      type: 'quiz',
      reactions: [{ emoji: '🔥', count: 4, users: ['user_me', 'friend_thomas', 'friend_sarah', 'friend_camille'] }],
      quizData: {
        id: 'quiz_series_1',
        title: 'Quiz Express : Séries & Cinéma',
        category: 'Pop Culture',
        description: '3 questions pour tester tes connaissances et gagner jusqu\'à 105 XP !',
        questions: [
          {
            id: 'q1',
            question: 'Dans quelle série retrouve-t-on le café mythique "Central Perk" ?',
            options: ['Friends', 'How I Met Your Mother', 'The Big Bang Theory', 'Brooklyn Nine-Nine'],
            correctAnswer: 0,
            explanation: 'Le Central Perk est le QG des 6 amis new-yorkais !',
          },
          {
            id: 'q2',
            question: 'Quel est le vrai nom de Heisenberg dans Breaking Bad ?',
            options: ['Jesse Pinkman', 'Walter White', 'Hank Schrader', 'Saul Goodman'],
            correctAnswer: 1,
            explanation: 'Walter White, professeur de chimie devenu baron clandestin.',
          },
          {
            id: 'q3',
            question: 'Quel jeu d\'enfants ouvre le tournoi dans Squid Game (Saison 1) ?',
            options: ['Le tir à la corde', '1, 2, 3, Soleil', 'Les billes', 'Le pont de verre'],
            correctAnswer: 1,
            explanation: '"Un, deux, trois, soleil" avec la poupée géante Yeong-hee.',
          },
        ],
        timeLimitSec: 30,
        xpReward: 105,
        coinsReward: 45,
        createdBy: 'Camille V.',
        createdAt: new Date().toISOString(),
        participantsCount: 3,
      },
    },
  ],
  channel_moods: [
    {
      id: 'msg_mood_1',
      conversationId: 'channel_moods',
      senderId: 'friend_sarah',
      senderName: 'Sarah K.',
      senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      content: 'Mise à jour d\'humeur : 🎉 En mode fête pour le week-end qui arrive ! N\'oubliez pas de faire vos streaks.',
      timestamp: '10:30',
      type: 'text',
      reactions: [{ emoji: '🎉', count: 3, users: ['user_me', 'friend_camille', 'friend_thomas'] }],
    },
  ],
  direct_camille: [
    {
      id: 'msg_dm_1',
      conversationId: 'direct_camille',
      senderId: 'friend_camille',
      senderName: 'Camille V.',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      content: 'Tu as vu le nouveau classement de la semaine ? 🔥 Tu es repassé dans le Top 3 !',
      timestamp: '11:15',
      type: 'text',
      reactions: [{ emoji: '👀', count: 1, users: ['user_me'] }],
    },
  ],
};

export const INITIAL_MARKETPLACE: MarketplaceItem[] = [
  {
    id: 'item_badge_cyber',
    name: 'Badge Cyber-Néon',
    description: 'Affiche une aura néon électrique violette sur votre profil et vos bulles de chat.',
    category: 'badge',
    icon: '🔮',
    price: 150,
    rarity: 'rare',
    unlocked: false,
  },
  {
    id: 'item_title_legend',
    name: 'Titre : Légende de la 2',
    description: 'Titre exclusif réservé aux membres les plus actifs de la communauté.',
    category: 'title',
    icon: '👑',
    price: 300,
    rarity: 'epic',
    unlocked: false,
  },
  {
    id: 'item_boost_xp',
    name: 'Booster XP Double (24h)',
    description: 'Double tous les gains d\'XP remportés lors des quizz et participations pendant 24 heures.',
    category: 'boost',
    icon: '⚡',
    price: 120,
    rarity: 'common',
    unlocked: true,
  },
  {
    id: 'item_theme_matrix',
    name: 'Thème Émeraude Matrix',
    description: 'Une palette néon vert émeraude futuriste pour votre interface.',
    category: 'theme',
    icon: '💚',
    price: 250,
    rarity: 'rare',
    unlocked: false,
  },
  {
    id: 'item_badge_phoenix',
    name: 'Badge Flamme Éternelle',
    description: 'Preuve ultime de régularité pour ceux qui maintiennent leurs flammes actives.',
    category: 'badge',
    icon: '🔥',
    price: 450,
    rarity: 'legendary',
    unlocked: false,
  },
];

export const INITIAL_BROADCASTS: AdminBroadcastNotification[] = [
  {
    id: 'notif_1',
    title: 'Tournoi Quizz du Samedi',
    content: 'Rejoignez le salon #le-lab-quizz ce soir à 20h pour remporter 500 XP et un badge exclusif !',
    type: 'announcement',
    sentBy: 'Admin Principal',
    sentAt: 'Il y a 2h',
    readCount: 42,
  },
  {
    id: 'notif_2',
    title: 'Nouveaux cosmétiques en boutique',
    content: 'Le badge Cyber-Néon et le titre Légende de la 2 sont désormais disponibles dans la boutique.',
    type: 'reward',
    sentBy: 'Alexandre L.',
    sentAt: 'Hier à 18:30',
    readCount: 68,
  },
];

export const INITIAL_LOGS: SystemAuditLog[] = [
  {
    id: 'log_1',
    action: 'BROADCAST_SENT',
    actorName: 'Alexandre L.',
    actorRole: 'admin',
    details: 'Notification push globale "Tournoi Quizz du Samedi" envoyée à 78 membres.',
    timestamp: 'Il y a 2h',
    severity: 'info',
  },
  {
    id: 'log_2',
    action: 'QUIZ_CREATED',
    actorName: 'Camille V.',
    actorRole: 'moderator',
    details: 'Quiz "Séries & Cinéma" créé et publié dans #le-lab-quizz.',
    timestamp: 'Il y a 3h',
    severity: 'success',
  },
  {
    id: 'log_3',
    action: 'BADGE_UNLOCKED',
    actorName: 'Sarah K.',
    actorRole: 'member',
    details: 'Badge "Flamme 7 Jours" débloqué automatiquement.',
    timestamp: 'Il y a 5h',
    severity: 'success',
  },
];

interface AppContextType {
  currentUser: UserProfile;
  friends: UserProfile[];
  conversations: Conversation[];
  activeConversationId: string;
  setActiveConversationId: (id: string) => void;
  messages: Record<string, ChatMessage[]>;
  marketplaceItems: MarketplaceItem[];
  broadcasts: AdminBroadcastNotification[];
  auditLogs: SystemAuditLog[];
  activeQuizModal: QuizData | null;
  setActiveQuizModal: (quiz: QuizData | null) => void;
  isSoundMuted: boolean;
  toggleSound: () => void;
  // Actions
  sendMessage: (content: string, type?: ChatMessage['type'], quizData?: QuizData) => void;
  reactToMessage: (messageId: string, emoji: string) => void;
  updateMood: (type: MoodType, customStatus?: string) => void;
  submitQuizScore: (quiz: QuizData, score: number, total: number) => void;
  createQuiz: (quiz: QuizData, sendToConversation?: boolean) => void;
  buyMarketplaceItem: (itemId: string) => boolean;
  sendAdminBroadcast: (title: string, content: string, type: AdminBroadcastNotification['type']) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  toggleRole: () => void;
  incrementStreak: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load saved state or defaults
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('surla2_user');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [friends, setFriends] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('surla2_friends');
      return saved ? JSON.parse(saved) : INITIAL_FRIENDS;
    } catch {
      return INITIAL_FRIENDS;
    }
  });

  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string>('channel_general');
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const saved = localStorage.getItem('surla2_messages');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(INITIAL_MARKETPLACE);
  const [broadcasts, setBroadcasts] = useState<AdminBroadcastNotification[]>(INITIAL_BROADCASTS);
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(INITIAL_LOGS);
  const [activeQuizModal, setActiveQuizModal] = useState<QuizData | null>(null);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('surla2_user', JSON.stringify(currentUser));
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('surla2_messages', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const toggleSound = () => {
    const nextState = !isSoundMuted;
    setIsSoundMuted(nextState);
    soundManager.setMuted(nextState);
  };

  const sendMessage = (
    content: string,
    type: ChatMessage['type'] = 'text',
    quizData?: QuizData
  ) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      conversationId: activeConversationId,
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      reactions: [],
      quizData,
    };

    setMessages((prev) => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), newMsg],
    }));

    // Update conversation last message preview
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? {
              ...c,
              lastMessage: {
                content: type === 'quiz' ? `🧠 Quiz: ${quizData?.title || 'Nouveau quiz'}` : content,
                timestamp: newMsg.timestamp,
                senderName: currentUser.displayName,
              },
            }
          : c
      )
    );

    // Play chime sound
    soundManager.playMessageSound();

    // Reward XP for messaging (+5 XP)
    setCurrentUser((prev) => {
      const newXp = prev.xp + 5;
      const newLevel = Math.floor(newXp / 500) + 1;
      if (newLevel > prev.level) {
        soundManager.playLevelUpSound();
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.8 } });
      }
      return { ...prev, xp: newXp, level: newLevel };
    });

    // Simulate smart friendly reply in channels after a short delay
    if (activeConversationId === 'channel_general' && type === 'text') {
      setTimeout(() => {
        const randomFriend = friends[Math.floor(Math.random() * friends.length)];
        const simulatedReplies = [
          'Carrément d\'accord ! 🔥',
          'Trop stylé, j\'adore cette fonctionnalité.',
          'Bien vu ! Quelqu\'un est chaud pour un quiz tout à l\'heure ? 🧠',
          'Haha exactement ! C\'est top d\'être tous connectés ici.',
        ];
        const replyText = simulatedReplies[Math.floor(Math.random() * simulatedReplies.length)];

        const botReply: ChatMessage = {
          id: `msg_bot_${Date.now()}`,
          conversationId: 'channel_general',
          senderId: randomFriend.id,
          senderName: randomFriend.displayName,
          senderAvatar: randomFriend.avatar,
          senderRole: randomFriend.role,
          content: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text',
          reactions: [{ emoji: '👍', count: 1, users: [currentUser.id] }],
        };

        setMessages((prev) => ({
          ...prev,
          channel_general: [...(prev.channel_general || []), botReply],
        }));

        soundManager.playMessageSound();
      }, 3500);
    }
  };

  const reactToMessage = (messageId: string, emoji: string) => {
    setMessages((prev) => {
      const convMessages = prev[activeConversationId] || [];
      const updated = convMessages.map((msg) => {
        if (msg.id !== messageId) return msg;

        const existingReaction = msg.reactions.find((r) => r.emoji === emoji);
        let newReactions = [...msg.reactions];

        if (existingReaction) {
          const userHasReacted = existingReaction.users.includes(currentUser.id);
          if (userHasReacted) {
            // Remove user reaction
            const newUsers = existingReaction.users.filter((u) => u !== currentUser.id);
            if (newUsers.length === 0) {
              newReactions = newReactions.filter((r) => r.emoji !== emoji);
            } else {
              newReactions = newReactions.map((r) =>
                r.emoji === emoji ? { ...r, count: newUsers.length, users: newUsers } : r
              );
            }
          } else {
            // Add user reaction
            newReactions = newReactions.map((r) =>
              r.emoji === emoji
                ? { ...r, count: r.count + 1, users: [...r.users, currentUser.id] }
                : r
            );
          }
        } else {
          // New emoji reaction
          newReactions.push({ emoji, count: 1, users: [currentUser.id] });
        }

        return { ...msg, reactions: newReactions };
      });

      return { ...prev, [activeConversationId]: updated };
    });
  };

  const updateMood = (type: MoodType, customStatus?: string) => {
    const def = MOOD_DEFINITIONS[type];
    const newMood: UserMood = {
      type,
      emoji: def.emoji,
      label: def.label,
      color: def.color,
      customStatus: customStatus || currentUser.mood.customStatus,
      updatedAt: 'À l\'instant',
    };

    setCurrentUser((prev) => ({
      ...prev,
      mood: newMood,
    }));

    // Post update in #humeurs-du-jour channel
    const moodAnnouncement: ChatMessage = {
      id: `mood_post_${Date.now()}`,
      conversationId: 'channel_moods',
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatar,
      content: `${def.emoji} Nouvelle humeur : **${def.label}** ${customStatus ? `— "${customStatus}"` : ''}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      reactions: [{ emoji: def.emoji, count: 1, users: [currentUser.id] }],
    };

    setMessages((prev) => ({
      ...prev,
      channel_moods: [...(prev.channel_moods || []), moodAnnouncement],
    }));

    soundManager.playSuccessSound();
  };

  const submitQuizScore = (quiz: QuizData, score: number, total: number) => {
    const ratio = score / total;
    const earnedXp = Math.round(quiz.xpReward * Math.max(0.3, ratio));
    const earnedCoins = Math.round(quiz.coinsReward * Math.max(0.3, ratio));

    setCurrentUser((prev) => {
      const nextXp = prev.xp + earnedXp;
      const nextCoins = prev.coins + earnedCoins;
      const nextLevel = Math.floor(nextXp / 500) + 1;

      return {
        ...prev,
        xp: nextXp,
        coins: nextCoins,
        level: nextLevel,
      };
    });

    if (ratio >= 0.7) {
      soundManager.playSuccessSound();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#38BDF8', '#10B981', '#F59E0B'],
      });
    } else {
      soundManager.playErrorSound();
    }
  };

  const createQuiz = (quiz: QuizData, sendToConversation: boolean = true) => {
    if (sendToConversation) {
      sendMessage(
        `Nouveau quiz disponible : **${quiz.title}** ! Qui fera le meilleur score ? 🧠`,
        'quiz',
        quiz
      );
    }

    setAuditLogs((prev) => [
      {
        id: `log_${Date.now()}`,
        action: 'QUIZ_CREATED',
        actorName: currentUser.displayName,
        actorRole: currentUser.role,
        details: `Quiz "${quiz.title}" (${quiz.questions.length} questions) créé avec succès.`,
        timestamp: 'À l\'instant',
        severity: 'success',
      },
      ...prev,
    ]);
  };

  const buyMarketplaceItem = (itemId: string): boolean => {
    const item = marketplaceItems.find((i) => i.id === itemId);
    if (!item) return false;
    if (currentUser.coins < item.price) {
      soundManager.playErrorSound();
      return false;
    }

    setCurrentUser((prev) => ({
      ...prev,
      coins: prev.coins - item.price,
      equippedBadge: item.category === 'badge' ? item.id : prev.equippedBadge,
      title: item.category === 'title' ? item.name.replace('Titre : ', '') : prev.title,
      badges: item.category === 'badge' ? [...prev.badges, item.id] : prev.badges,
    }));

    setMarketplaceItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, unlocked: true } : i))
    );

    soundManager.playSuccessSound();
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    return true;
  };

  const sendAdminBroadcast = (
    title: string,
    content: string,
    type: AdminBroadcastNotification['type']
  ) => {
    const newBroadcast: AdminBroadcastNotification = {
      id: `broadcast_${Date.now()}`,
      title,
      content,
      type,
      sentBy: currentUser.displayName,
      sentAt: 'À l\'instant',
      readCount: 1,
    };

    setBroadcasts((prev) => [newBroadcast, ...prev]);

    setAuditLogs((prev) => [
      {
        id: `log_${Date.now()}`,
        action: 'BROADCAST_SENT',
        actorName: currentUser.displayName,
        actorRole: currentUser.role,
        details: `Notification push générale diffusée : "${title}".`,
        timestamp: 'À l\'instant',
        severity: 'info',
      },
      ...prev,
    ]);

    soundManager.playLevelUpSound();
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
  };

  const toggleRole = () => {
    setCurrentUser((prev) => ({
      ...prev,
      role: prev.role === 'admin' ? 'member' : 'admin',
    }));
  };

  const incrementStreak = () => {
    setCurrentUser((prev) => ({
      ...prev,
      streakDays: prev.streakDays + 1,
      xp: prev.xp + 50,
      coins: prev.coins + 20,
    }));
    soundManager.playSuccessSound();
    confetti({ particleCount: 50, spread: 60 });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        friends,
        conversations,
        activeConversationId,
        setActiveConversationId,
        messages,
        marketplaceItems,
        broadcasts,
        auditLogs,
        activeQuizModal,
        setActiveQuizModal,
        isSoundMuted,
        toggleSound,
        sendMessage,
        reactToMessage,
        updateMood,
        submitQuizScore,
        createQuiz,
        buyMarketplaceItem,
        sendAdminBroadcast,
        updateUserProfile,
        toggleRole,
        incrementStreak,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
