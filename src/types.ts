export type Language = 'ar' | 'en' | 'fr' | 'es';
export type ThemeMode = 'dark' | 'light' | 'auto';
export type AccentColor = 'indigo' | 'emerald' | 'violet' | 'rose' | 'amber' | 'cyan';

export interface UserLink {
  id: string;
  label: string;
  url: string;
  icon?: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  banner: string;
  bio: string;
  verified: boolean;
  followersCount: number;
  followingCount: number;
  walletBalance: number;
  isCreator: boolean;
  twoFactorEnabled: boolean;
  email: string;
  note?: string;
  links?: UserLink[];
  postsCount?: number;
  category?: string;
}

export interface FollowerUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  verified?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: { text: string; votes: number }[];
  totalVotes: number;
  userVote?: number;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userHandle: string;
  userAvatar: string;
  verified: boolean;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  poll?: Poll;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  tipsTotal: number;
  isLiked: boolean;
  isSaved: boolean;
  isExclusive?: boolean;
  exclusivePrice?: number;
  createdAt: string;
  comments: Comment[];
  reactions?: Record<string, number>;
}

export interface Reel {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  verified: boolean;
  videoUrl: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  musicTitle: string;
  filter?: string;
  trimStart?: number;
  trimEnd?: number;
}

export interface LiveStream {
  id: string;
  title: string;
  streamerId: string;
  streamerName: string;
  streamerAvatar: string;
  viewersCount: number;
  isLive: boolean;
  category: string;
  thumbnail: string;
}

export interface VoiceRoom {
  id: string;
  title: string;
  hostName: string;
  hostAvatar: string;
  listenersCount: number;
  isEncrypted: boolean;
  speakers: { id: string; name: string; avatar: string; isMuted: boolean }[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  audioUrl?: string;
  imageUrl?: string;
  isWave?: boolean;
  hasHeartReaction?: boolean;
  timestamp: string;
  isEncrypted?: boolean;
  reactions?: Record<string, number>;
  status?: 'sent' | 'delivered' | 'seen';
}

export interface ChatConversation {
  id: string;
  name: string;
  handle?: string;
  avatar: string;
  isGroup: boolean;
  isOnline?: boolean;
  category?: 'primary' | 'general' | 'requests';
  followersCount?: number;
  postsCount?: number;
  mutualFriendsText?: string;
  userNote?: string;
  lastMessage: string;
  unreadCount: number;
  updatedAt: string;
  membersCount?: number;
  messages: ChatMessage[];
}

export interface FriendNote {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  noteText: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'tip' | 'message' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actorAvatar?: string;
}

export interface NotificationPreferences {
  likes: boolean;
  comments: boolean;
  messages: boolean;
  follows: boolean;
  tips: boolean;
  system: boolean;
  quietMode: boolean;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'deposit' | 'tip' | 'purchase' | 'earning';
  date: string;
  status: 'completed' | 'pending';
}

export interface StoryOverlay {
  type: 'text' | 'sticker';
  content: string;
  x: number;
  y: number;
  color?: string;
  fontSize?: number;
}

export interface StoryViewer {
  userId: string;
  userName: string;
  userAvatar: string;
  viewedAt: string;
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  mediaUrls: string[];
  mediaType: 'image' | 'video';
  createdAt: string;
  isViewed: boolean;
  filter?: string;
  layout?: string;
  backgroundColor?: string;
  overlays?: StoryOverlay[];
  viewers?: StoryViewer[];
  reactions?: Record<string, number>;
}
