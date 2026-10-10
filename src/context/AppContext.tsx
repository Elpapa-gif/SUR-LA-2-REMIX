import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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
import { supabase, isSupabaseConfigured, SUPABASE_URL } from '../integrations/supabase/client';

export const MOOD_DEFINITIONS: Record<MoodType, { label: string; emoji: string; color: string }> = {
  energetic: { label: 'En pleine forme', emoji: '⚡', color: '#10B981' },
  chill: { label: 'Mode détente', emoji: '☕', color: '#38BDF8' },
  focused: { label: 'En plein focus', emoji: '🎯', color: '#8B5CF6' },
  stressed: { label: 'Sous l\'eau', emoji: '🌊', color: '#F43F5E' },
  party: { label: 'Ambiance fête', emoji: '🎉', color: '#F59E0B' },
  creative: { label: 'Inspiration max', emoji: '🎨', color: '#EC4899' },
};

// Clean real default user (ready to link to Supabase Auth or customize)
export const DEFAULT_USER: UserProfile = {
  id: 'me',
  username: 'nouveau_membre',
  displayName: 'Mon Profil',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'admin', // Admin by default so user can test all features
  title: 'Pionnier de la 2',
  mood: {
    type: 'energetic',
    emoji: '⚡',
    label: 'En pleine forme',
    color: '#10B981',
    customStatus: 'Prêt à explorer Sur la 2 !',
    updatedAt: 'Aujourd\'hui',
  },
  streakDays: 1,
  lastActive: new Date().toISOString(),
  xp: 50,
  level: 1,
  coins: 100,
  equippedBadge: 'badge_flame',
  badges: ['badge_flame'],
  bio: 'Bienvenue sur mon profil Sur la 2.',
};

// Real channels created in Supabase database
export const DEFAULT_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    name: 'général - Sur la 2',
    type: 'channel',
    topic: 'Le salon central de la communauté : actus et discussions ⚡',
    avatar: '⚡',
    isPinned: true,
    unreadCount: 0,
    members: [],
    category: 'salons',
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    name: 'le-lab-quizz',
    type: 'channel',
    topic: 'Défis en direct, duels et quizz IA 🧠',
    avatar: '🧠',
    isPinned: true,
    unreadCount: 0,
    members: [],
    category: 'salons',
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    name: 'humeurs-du-jour',
    type: 'channel',
    topic: 'Partagez votre météo émotionnelle quotidienne ☀️',
    avatar: '🎭',
    isPinned: false,
    unreadCount: 0,
    members: [],
    category: 'salons',
  },
];

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
    unlocked: false,
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
  isSupabaseActive: boolean;
  supabaseUrl: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Current user state (persisted or defaults)
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('surla2_real_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  // REAL members from Supabase profiles table (empty until members sign up)
  const [friends, setFriends] = useState<UserProfile[]>([]);

  // REAL conversations (channels)
  const [conversations, setConversations] = useState<Conversation[]>(DEFAULT_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string>('c1111111-1111-1111-1111-111111111111');

  // REAL messages (starts completely empty, zero mock data)
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});

  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(INITIAL_MARKETPLACE);
  const [broadcasts, setBroadcasts] = useState<AdminBroadcastNotification[]>([]);
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>([]);
  const [activeQuizModal, setActiveQuizModal] = useState<QuizData | null>(null);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [isSupabaseActive, setIsSupabaseActive] = useState<boolean>(() => isSupabaseConfigured());

  // 1. Load real data from Supabase on mount
  const refreshSupabaseData = useCallback(async () => {
    if (!isSupabaseConfigured()) return;

    try {
      // A. Fetch real channels
      const { data: convData } = await supabase.from('conversations').select('*');
      if (convData && convData.length > 0) {
        setConversations(
          convData.map((c) => ({
            id: c.id,
            name: c.name,
            type: c.type as 'channel' | 'direct',
            topic: c.topic || '',
            avatar: c.avatar || '⚡',
            isPinned: c.is_pinned || false,
            unreadCount: 0,
            members: [],
            category: (c.category as any) || 'salons',
          }))
        );
      }

      // B. Fetch real registered member profiles
      const { data: profilesData } = await supabase.from('profiles').select('*');
      if (profilesData && profilesData.length > 0) {
        const realMembers: UserProfile[] = profilesData
          .filter((p) => p.id !== currentUser.id)
          .map((p) => ({
            id: p.id,
            username: p.username || 'membre',
            displayName: p.display_name || 'Membre Sur la 2',
            avatar: p.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            role: (p.role as any) || 'member',
            title: p.title || 'Membre',
            mood: {
              type: (p.mood_type as MoodType) || 'energetic',
              emoji: p.mood_emoji || '⚡',
              label: p.mood_label || 'En forme',
              color: p.mood_color || '#10B981',
              customStatus: p.mood_custom_status || undefined,
              updatedAt: p.mood_updated_at ? new Date(p.mood_updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Aujourd\'hui',
            },
            streakDays: p.streak_days || 1,
            lastActive: p.last_active_at ? 'En ligne' : 'Récemment',
            xp: p.xp || 0,
            level: p.level || 1,
            coins: p.coins || 100,
            equippedBadge: p.equipped_badge || undefined,
            badges: p.badges || ['badge_flame'],
            bio: p.bio || undefined,
          }));
        setFriends(realMembers);
      }

      // C. Fetch real messages
      const { data: msgData } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (msgData && msgData.length > 0) {
        const grouped: Record<string, ChatMessage[]> = {};
        msgData.forEach((m) => {
          const cId = m.conversation_id || 'c1111111-1111-1111-1111-111111111111';
          if (!grouped[cId]) grouped[cId] = [];
          grouped[cId].push({
            id: m.id,
            conversationId: cId,
            senderId: m.sender_id,
            senderName: m.sender_name,
            senderAvatar: m.sender_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            senderRole: (m.sender_role as any) || 'member',
            content: m.content,
            timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: (m.message_type as any) || 'text',
            reactions: [],
          });
        });
        setMessages(grouped);
      }

      // D. Check logged in user session
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        const u = authData.user;
        const myProfile = profilesData?.find((p) => p.id === u.id);
        setCurrentUser((prev) => ({
          ...prev,
          id: u.id,
          username: myProfile?.username || u.user_metadata?.username || u.email?.split('@')[0] || 'membre',
          displayName: myProfile?.display_name || u.user_metadata?.display_name || u.email?.split('@')[0] || 'Moi',
          role: (myProfile?.role as any) || prev.role,
          xp: myProfile?.xp || prev.xp,
          level: myProfile?.level || prev.level,
          coins: myProfile?.coins || prev.coins,
          streakDays: myProfile?.streak_days || prev.streakDays,
        }));
      }

      setIsSupabaseActive(true);
    } catch (err) {
      console.warn('Erreur lors du chargement des données Supabase:', err);
    }
  }, [currentUser.id]);

  useEffect(() => {
    refreshSupabaseData();

    // Listen to real-time incoming messages
    if (!isSupabaseConfigured()) return;

    const channel = supabase
      .channel('realtime:public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const row = payload.new as any;
          if (!row) return;

          const incomingMsg: ChatMessage = {
            id: row.id,
            conversationId: row.conversation_id || 'c1111111-1111-1111-1111-111111111111',
            senderId: row.sender_id,
            senderName: row.sender_name || 'Membre',
            senderAvatar: row.sender_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            senderRole: row.sender_role || 'member',
            content: row.content,
            timestamp: new Date(row.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: row.message_type || 'text',
            reactions: [],
          };

          setMessages((prev) => {
            const list = prev[incomingMsg.conversationId] || [];
            if (list.some((m) => m.id === incomingMsg.id)) return prev;
            return {
              ...prev,
              [incomingMsg.conversationId]: [...list, incomingMsg],
            };
          });

          soundManager.playMessageSound();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshSupabaseData]);

  // Sync current user to local storage
  useEffect(() => {
    try {
      localStorage.setItem('surla2_real_user', JSON.stringify(currentUser));
    } catch {}
  }, [currentUser]);

  const toggleSound = () => {
    const nextState = !isSoundMuted;
    setIsSoundMuted(nextState);
    soundManager.setMuted(nextState);
  };

  // SEND REAL MESSAGE (writes to Supabase messages table)
  const sendMessage = async (
    content: string,
    type: ChatMessage['type'] = 'text',
    quizData?: QuizData
  ) => {
    const tempId = `msg_${Date.now()}`;
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: tempId,
      conversationId: activeConversationId,
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      content,
      timestamp: timestampStr,
      type,
      reactions: [],
      quizData,
    };

    // Optimistic UI update
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
                timestamp: timestampStr,
                senderName: currentUser.displayName,
              },
            }
          : c
      )
    );

    soundManager.playMessageSound();

    // Reward XP (+5 XP)
    setCurrentUser((prev) => {
      const newXp = prev.xp + 5;
      const newLevel = Math.floor(newXp / 500) + 1;
      if (newLevel > prev.level) {
        soundManager.playLevelUpSound();
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.8 } });
      }
      return { ...prev, xp: newXp, level: newLevel };
    });

    // Write real message to Supabase
    if (isSupabaseConfigured()) {
      try {
        const { data: authUser } = await supabase.auth.getUser();
        const validSenderId = authUser?.user?.id || '00000000-0000-0000-0000-000000000001';

        await supabase.from('messages').insert({
          conversation_id: activeConversationId,
          sender_id: validSenderId,
          sender_name: currentUser.displayName,
          sender_avatar: currentUser.avatar,
          sender_role: currentUser.role,
          content,
          message_type: type,
        });
      } catch (err) {
        console.warn('Message saved locally (Supabase insert):', err);
      }
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
            const newUsers = existingReaction.users.filter((u) => u !== currentUser.id);
            if (newUsers.length === 0) {
              newReactions = newReactions.filter((r) => r.emoji !== emoji);
            } else {
              newReactions = newReactions.map((r) =>
                r.emoji === emoji ? { ...r, count: newUsers.length, users: newUsers } : r
              );
            }
          } else {
            newReactions = newReactions.map((r) =>
              r.emoji === emoji
                ? { ...r, count: r.count + 1, users: [...r.users, currentUser.id] }
                : r
            );
          }
        } else {
          newReactions.push({ emoji, count: 1, users: [currentUser.id] });
        }

        return { ...msg, reactions: newReactions };
      });

      return { ...prev, [activeConversationId]: updated };
    });
  };

  // UPDATE REAL MOOD (Syncs to Supabase profiles)
  const updateMood = async (type: MoodType, customStatus?: string) => {
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

    // Post to #humeurs-du-jour channel
    sendMessage(
      `${def.emoji} Nouvelle humeur : **${def.label}** ${customStatus ? `— "${customStatus}"` : ''}`,
      'text'
    );

    // Sync to Supabase profile
    if (isSupabaseConfigured()) {
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user) {
          await supabase.from('profiles').update({
            mood_type: type,
            mood_emoji: def.emoji,
            mood_label: def.label,
            mood_color: def.color,
            mood_custom_status: customStatus || null,
            mood_updated_at: new Date().toISOString(),
          }).eq('id', authData.user.id);
        }
      } catch (err) {
        console.warn('Mood sync:', err);
      }
    }

    soundManager.playSuccessSound();
  };

  const submitQuizScore = async (quiz: QuizData, score: number, total: number) => {
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

  // CREATE REAL QUIZ (Syncs to Supabase quizzes & quiz_questions)
  const createQuiz = async (quiz: QuizData, sendToConversation: boolean = true) => {
    if (sendToConversation) {
      sendMessage(
        `Nouveau quiz disponible : **${quiz.title}** ! Qui fera le meilleur score ? 🧠`,
        'quiz',
        quiz
      );
    }

    // Save quiz to Supabase
    if (isSupabaseConfigured()) {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const validUserId = authData?.user?.id || null;

        const { data: createdQuizRow } = await supabase.from('quizzes').insert({
          title: quiz.title,
          category: quiz.category,
          description: quiz.description,
          time_limit_sec: quiz.timeLimitSec,
          xp_reward: quiz.xpReward,
          coins_reward: quiz.coinsReward,
          created_by_user_id: validUserId,
          created_by_name: currentUser.displayName,
          participants_count: 0,
        }).select().single();

        if (createdQuizRow && quiz.questions.length > 0) {
          const questionsToInsert = quiz.questions.map((q, idx) => ({
            quiz_id: createdQuizRow.id,
            question: q.question,
            options: q.options,
            correct_answer: q.correctAnswer,
            explanation: q.explanation || '',
            order_index: idx,
          }));

          await supabase.from('quiz_questions').insert(questionsToInsert);
        }
      } catch (err) {
        console.warn('Quiz DB insert error:', err);
      }
    }

    setAuditLogs((prev) => [
      {
        id: `log_${Date.now()}`,
        action: 'QUIZ_CREATED',
        actorName: currentUser.displayName,
        actorRole: currentUser.role,
        details: `Quiz "${quiz.title}" (${quiz.questions.length} questions) créé et publié.`,
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

  const sendAdminBroadcast = async (
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

    // Save to Supabase admin_broadcasts
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('admin_broadcasts').insert({
          title,
          content,
          type,
          sent_by: currentUser.displayName,
        });
      } catch {}
    }

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
    refreshSupabaseData();
  };

  const toggleRole = () => {
    setCurrentUser((prev) => ({
      ...prev,
      role: prev.role === 'admin' ? 'member' : 'admin',
    }));
  };

  const incrementStreak = async () => {
    const nextStreak = currentUser.streakDays + 1;
    const nextXp = currentUser.xp + 50;
    const nextCoins = currentUser.coins + 20;

    setCurrentUser((prev) => ({
      ...prev,
      streakDays: nextStreak,
      xp: nextXp,
      coins: nextCoins,
    }));

    if (isSupabaseConfigured()) {
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user) {
          await supabase.from('profiles').update({
            streak_days: nextStreak,
            xp: nextXp,
            coins: nextCoins,
            last_active_at: new Date().toISOString(),
          }).eq('id', authData.user.id);
        }
      } catch {}
    }

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
        isSupabaseActive,
        supabaseUrl: SUPABASE_URL,
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
