import React from 'react';
import { Sparkles, X } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { FeedView } from './components/FeedView';
import { ReelsView } from './components/ReelsView';
import { LiveStreamView } from './components/LiveStreamView';
import { VoiceChatView } from './components/VoiceChatView';
import { ChatView } from './components/ChatView';
import { SavedView } from './components/SavedView';
import { WalletView } from './components/WalletView';
import { AnalyticsView } from './components/AnalyticsView';
import { NotificationsView } from './components/NotificationsView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { DownloadAppView } from './components/DownloadAppView';
import { BottomNav } from './components/BottomNav';
import { PWAInstallButton } from './components/PWAInstallButton';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
      {activeTab === 'feed' && <FeedView />}
      {activeTab === 'reels' && <ReelsView />}
      {activeTab === 'live' && <LiveStreamView />}
      {activeTab === 'voice' && <VoiceChatView />}
      {activeTab === 'messages' && <ChatView />}
      {activeTab === 'saved' && <SavedView />}
      {activeTab === 'wallet' && <WalletView />}
      {activeTab === 'analytics' && <AnalyticsView />}
      {activeTab === 'notifications' && <NotificationsView />}
      {activeTab === 'profile' && <ProfileView />}
      {activeTab === 'settings' && <SettingsView />}
      {activeTab === 'download' && <DownloadAppView />}
    </main>
  );
};

const GlobalToast: React.FC = () => {
  const { followToast, dismissFollowToast } = useApp();
  if (!followToast) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/95 border border-indigo-500/40 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
      <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
      <span>{followToast}</span>
      <button onClick={dismissFollowToast} className="mr-1 text-neutral-400 hover:text-white">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col transition-colors font-sans selection:bg-indigo-500 selection:text-white">
        <PWAInstallButton variant="banner" />
        <Navbar />
        <GlobalToast />
        <div className="flex-1 max-w-7xl mx-auto w-full flex">
          <Sidebar />
          <MainContent />
        </div>
        <AuthModal />
        <AiAssistantModal />
        <BottomNav />
      </div>
    </AppProvider>
  );
}
