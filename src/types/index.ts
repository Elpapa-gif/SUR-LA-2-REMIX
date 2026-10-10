export type UserRole = 'admin' | 'moderator' | 'member';

export type MoodType = 'energetic' | 'chill' | 'focused' | 'stressed' | 'party' | 'creative';

export interface UserMood {
  type: MoodType;
  emoji: string;
  label: string;
  color: string;
  customStatus?: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  role: UserRole;
  title: string;
  mood: UserMood;
  streakDays: number;
  lastActive: string;
  xp: number;
  level: number;
  coins: number;
  equippedBadge?: string;
  badges: string[];
  bio?: string;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[]; // user ids
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizData {
  id: string;
  title: string;
  category: string;
  description: string;
  questions: QuizQuestion[];
  timeLimitSec: number;
  xpReward: number;
  coinsReward: number;
  createdBy: string;
  createdAt: string;
  participantsCount: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole?: UserRole;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'quiz' | 'system' | 'voice';
  reactions: MessageReaction[];
  quizData?: QuizData;
  imageUrl?: string;
  audioDuration?: number;
  replyTo?: {
    id: string;
    senderName: string;
    content: string;
  };
}

export interface Conversation {
  id: string;
  name: string;
  type: 'channel' | 'direct';
  topic?: string;
  avatar?: string;
  isPinned?: boolean;
  unreadCount: number;
  lastMessage?: {
    content: string;
    timestamp: string;
    senderName: string;
  };
  members: string[]; // user ids
  category?: 'salons' | 'groupes' | 'directs';
}

export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  category: 'badge' | 'title' | 'theme' | 'boost';
  icon: string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
}

export interface AdminBroadcastNotification {
  id: string;
  title: string;
  content: string;
  type: 'announcement' | 'alert' | 'reward';
  sentBy: string;
  sentAt: string;
  readCount: number;
}

export interface SystemAuditLog {
  id: string;
  action: string;
  actorName: string;
  actorRole: string;
  details: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'success';
}
