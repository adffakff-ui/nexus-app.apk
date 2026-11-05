import { User, Post, Reel, LiveStream, VoiceRoom, ChatConversation, NotificationItem, Transaction, FriendNote } from '../types';

export const currentUser: User = {
  id: 'u1',
  name: 'اسم المستخدم',
  username: '@user',
  avatar: '',
  banner: '',
  bio: '',
  verified: false,
  postsCount: 0,
  followersCount: 0,
  followingCount: 0,
  walletBalance: 0,
  isCreator: false,
  twoFactorEnabled: false,
  email: '',
  category: '',
  note: '',
  links: []
};

export const initialPosts: Post[] = [];
export const initialReels: Reel[] = [];
export const initialLiveStreams: LiveStream[] = [];
export const initialVoiceRooms: VoiceRoom[] = [];
export const initialChats: ChatConversation[] = [];
export const initialNotifications: NotificationItem[] = [];
export const initialTransactions: Transaction[] = [];
export const initialFriendNotes: FriendNote[] = [];
