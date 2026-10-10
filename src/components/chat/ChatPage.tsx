import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Brain,
  Smile,
  Paperclip,
  Mic,
  Hash,
  Users,
  Info,
  Loader2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MessageBubble } from './MessageBubble';
import { ConversationsList } from './ConversationsList';
import { generateIcebreakerTopic } from '../../services/gemini';
import { QuizData } from '../../types';

interface ChatPageProps {
  onOpenNewQuiz: () => void;
  onLaunchFullQuiz: (quiz: QuizData) => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  onOpenNewQuiz,
  onLaunchFullQuiz,
}) => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    messages,
    sendMessage,
    currentUser,
  } = useApp();

  const [inputMessage, setInputMessage] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const activeMessages = messages[activeConversationId] || [];

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    sendMessage(inputMessage.trim(), 'text');
    setInputMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAiIcebreaker = async () => {
    setIsAiLoading(true);
    try {
      const icebreaker = await generateIcebreakerTopic();
      setInputMessage(icebreaker);
    } catch {
      setInputMessage("🔥 Dilemme du jour : Vous préférez voyager dans le passé ou dans le futur ?");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#0B0F19]">
      {/* Sidebar Channels & Direct Messages */}
      <ConversationsList
        activeId={activeConversationId}
        onSelectConversation={setActiveConversationId}
      />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col h-full overflow-hidden bg-slate-950/40">
        {/* Chat Room Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/80 bg-[#0B0F19]/80 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400 ring-1 ring-violet-500/30">
              {activeConv.type === 'channel' ? <Hash className="h-5 w-5" /> : activeConv.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {activeConv.type === 'channel' ? `#${activeConv.name}` : activeConv.name}
                </h3>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>En direct</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
                {activeConv.topic || 'Discussion privée'}
              </p>
            </div>
          </div>

          {/* Action bar for active channel */}
          <div className="flex items-center gap-2">
            {/* AI Icebreaker button */}
            <button
              onClick={handleAiIcebreaker}
              disabled={isAiLoading}
              className="flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-600/10 px-2.5 py-1.5 text-xs font-medium text-violet-300 hover:bg-violet-600/20 transition-colors disabled:opacity-50"
              title="Générer un sujet de conversation instantané avec l'IA"
            >
              {isAiLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-400" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              )}
              <span className="hidden sm:inline">Relancer ✨</span>
            </button>

            {/* Launch Quiz shortcut */}
            <button
              onClick={onOpenNewQuiz}
              className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition-colors"
              title="Lancer un quiz dans ce salon"
            >
              <Brain className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">Quiz</span>
            </button>
          </div>
        </header>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-3">
          {/* Welcome Card */}
          <div className="mx-auto my-4 max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400 ring-1 ring-violet-500/30 mb-2">
              <Hash className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Début de {activeConv.type === 'channel' ? `#${activeConv.name}` : activeConv.name}
            </h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Partagez vos humeurs, vos anecdotes et défiez les membres de la 2 avec des mini-quizz !
            </p>
          </div>

          {/* Active messages list */}
          {activeMessages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isMe={msg.senderId === currentUser.id}
              onLaunchFullQuiz={onLaunchFullQuiz}
            />
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <div className="shrink-0 border-t border-slate-800/80 bg-[#0B0F19]/90 p-3 sm:p-4">
          <form onSubmit={handleSend} className="mx-auto max-w-4xl">
            <div className="relative flex flex-col rounded-2xl border border-slate-800 bg-slate-900/90 shadow-lg focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                placeholder={`Envoyer un message dans #${activeConv.name}... (Entrée pour envoyer)`}
                className="w-full resize-none bg-transparent px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
              />

              {/* Bottom toolbar */}
              <div className="flex items-center justify-between border-t border-slate-800/60 px-3 py-2">
                <div className="flex items-center gap-1">
                  {/* Quick Emojis */}
                  {['🔥', '⚡', '☕', '😂', '🎯'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setInputMessage((prev) => prev + emoji)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-xs hover:bg-slate-800 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}

                  <div className="h-4 w-px bg-slate-800 mx-1" />

                  {/* AI quiz trigger button */}
                  <button
                    type="button"
                    onClick={onOpenNewQuiz}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-amber-400 hover:bg-amber-500/10 transition-colors"
                    title="Insérer un quiz"
                  >
                    <Brain className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Quiz</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline text-[10px] text-slate-500">
                    +5 XP par message
                  </span>

                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md transition-all hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
