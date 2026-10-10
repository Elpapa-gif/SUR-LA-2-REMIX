import React, { useState } from 'react';
import {
  Hash,
  MessageSquare,
  Search,
  Plus,
  Pin,
  Flame,
} from 'lucide-react';
import { Conversation } from '../../types';
import { useApp } from '../../context/AppContext';
import { Avatar } from './Avatar';

interface ConversationsListProps {
  onSelectConversation: (id: string) => void;
  activeId: string;
  className?: string;
  onOpenChatOnMobile?: () => void;
}

export const ConversationsList: React.FC<ConversationsListProps> = ({
  onSelectConversation,
  activeId,
  className,
  onOpenChatOnMobile,
}) => {
  const { conversations, friends } = useApp();
  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'channels' | 'directs'>('all');

  const filtered = conversations.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'channels') return c.type === 'channel';
    if (filter === 'directs') return c.type === 'direct';
    return true;
  });

  return (
    <aside className={`flex h-full flex-col border-r border-slate-800/80 bg-[#0B0F19]/60 backdrop-blur-sm ${className || 'w-full md:w-72 lg:w-80'}`}>
      {/* Header & Search */}
      <div className="p-3.5 border-b border-slate-800/70">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <span>Conversations</span>
            <span className="text-[11px] font-normal text-slate-400">
              ({conversations.length})
            </span>
          </h2>

          {onOpenChatOnMobile && (
            <button
              onClick={onOpenChatOnMobile}
              className="text-xs font-semibold text-violet-400 hover:text-violet-300 md:hidden transition-colors"
            >
              Vers le chat →
            </button>
          )}
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un salon, ami..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>

        {/* Filter buttons */}
        <div className="mt-2.5 flex items-center gap-1 p-1 bg-slate-900/90 rounded-lg border border-slate-800/60">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 rounded-md py-1 text-[11px] font-medium transition-colors ${
              filter === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('channels')}
            className={`flex-1 rounded-md py-1 text-[11px] font-medium transition-colors ${
              filter === 'channels'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Salons
          </button>
          <button
            onClick={() => setFilter('directs')}
            className={`flex-1 rounded-md py-1 text-[11px] font-medium transition-colors ${
              filter === 'directs'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Directs
          </button>
        </div>
      </div>

      {/* Conversations Scroll Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filtered.map((conv) => {
          const isActive = conv.id === activeId;
          const friendData =
            conv.type === 'direct'
              ? friends.find((f) => conv.members.includes(f.id))
              : null;

          return (
            <button
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-all ${
                isActive
                  ? 'bg-violet-600/15 border border-violet-500/30 text-white shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                  : 'hover:bg-slate-900/70 text-slate-300 border border-transparent'
              }`}
            >
              {/* Icon / Avatar */}
              {conv.type === 'channel' ? (
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base ${
                    isActive
                      ? 'bg-violet-600/30 text-violet-300 ring-1 ring-violet-500/50'
                      : 'bg-slate-800/80 text-slate-400'
                  }`}
                >
                  {conv.avatar || <Hash className="h-5 w-5" />}
                </div>
              ) : (
                <Avatar
                  src={
                    friendData?.avatar ||
                    conv.avatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
                  }
                  name={conv.name}
                  size="md"
                  moodEmoji={friendData?.mood.emoji}
                />
              )}

              {/* Text Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span
                    className={`truncate text-xs font-semibold ${
                      isActive ? 'text-white' : 'text-slate-200'
                    }`}
                  >
                    {conv.type === 'channel' ? `#${conv.name}` : conv.name}
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    {conv.isPinned && (
                      <Pin className="h-3 w-3 text-violet-400/80 fill-violet-400/20" />
                    )}
                    {conv.lastMessage?.timestamp && (
                      <span className="text-[10px] text-slate-400">
                        {conv.lastMessage.timestamp}
                      </span>
                    )}
                  </div>
                </div>

                <p className="truncate text-[11px] text-slate-400">
                  {conv.lastMessage?.content || conv.topic || 'Aucun message pour le moment'}
                </p>
              </div>

              {/* Unread badge */}
              {conv.unreadCount > 0 && !isActive && (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white shadow-sm">
                  {conv.unreadCount}
                </span>
              )}
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-6 text-center text-xs text-slate-500">
            Aucune conversation trouvée.
          </div>
        )}
      </div>

      {/* Footer Banner - Streaks encouragement */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-amber-500/10 via-violet-500/10 to-cyan-500/10 p-2.5 border border-slate-800">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-400 fill-amber-400" />
            <div className="text-[11px]">
              <p className="font-semibold text-slate-200">Série active</p>
              <p className="text-slate-400">Gardez vos flammes en participant</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
