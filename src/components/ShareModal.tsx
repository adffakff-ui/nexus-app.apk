import React from 'react';
import { X, Copy, Twitter, Facebook } from 'lucide-react';
import { Post } from '../types';

interface ShareModalProps {
  post: Post;
  onClose: () => void;
}

import { useApp } from '../context/AppContext';
import { Send, UserCircle } from 'lucide-react';

export const ShareModal: React.FC<ShareModalProps> = ({ post, onClose }) => {
  const { shareToStory, shareToChat, chats } = useApp();
  // ...
  const postUrl = `${window.location.origin}/post/${post.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(postUrl);
    alert('تم نسخ الرابط بنجاح!');
  };

  const shareTo = (platform: string) => {
    let url = '';
    const text = encodeURIComponent(`شاهد هذا المنشور الرائع على نكسوس: ${post.content.substring(0, 50)}...`);
    if (platform === 'twitter') url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${text}`;
    if (platform === 'facebook') url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
    
    if (url) window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-slate-900 dark:text-white">مشاركة المنشور</h3>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:hover:text-white"><X className="w-5 h-5"/></button>
        </div>
        
        <div className="space-y-2">
            <button onClick={() => { shareToStory(post.id); onClose(); }} className="w-full flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors">
                <UserCircle className="w-4 h-4"/> مشاركة في قصتك
            </button>
            
            <div className="pt-2">
                <p className="text-[10px] text-slate-400 mb-2 px-1 uppercase font-bold">مشاركة في دردشة</p>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                    {chats.map(chat => (
                        <button 
                            key={chat.id} 
                            onClick={() => { shareToChat(post.id, chat.id); onClose(); }}
                            className="flex flex-col items-center gap-1 shrink-0 group"
                        >
                            <img src={chat.avatar} alt="" className="w-10 h-10 rounded-xl object-cover ring-2 ring-transparent group-hover:ring-emerald-500 transition-all" />
                            <span className="text-[9px] text-slate-500 dark:text-slate-400 truncate w-12 text-center">{chat.name.split(' ')[0]}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase font-bold">خارجي</span>
            <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
        </div>

        <button onClick={copyToClipboard} className="w-full flex items-center justify-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <Copy className="w-4 h-4"/> نسخ الرابط
        </button>
        
        <div className="grid grid-cols-2 gap-3 pt-2">
            <button onClick={() => shareTo('twitter')} className="p-3 bg-[#1DA1F2] text-white rounded-xl flex items-center justify-center gap-2 text-sm font-bold hover:opacity-90 transition-opacity">
                <Twitter className="w-4 h-4"/> Twitter
            </button>
            <button onClick={() => shareTo('facebook')} className="p-3 bg-[#4267B2] text-white rounded-xl flex items-center justify-center gap-2 text-sm font-bold hover:opacity-90 transition-opacity">
                <Facebook className="w-4 h-4"/> Facebook
            </button>
        </div>
      </div>
    </div>
  );
};
