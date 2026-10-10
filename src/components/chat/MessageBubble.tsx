import React, { useState } from 'react';
import { Smile, Sparkles, CornerDownLeft } from 'lucide-react';
import { ChatMessage } from '../../types';
import { Avatar } from './Avatar';
import { QuizMessage } from '../quiz/QuizMessage';
import { useApp } from '../../context/AppContext';

interface MessageBubbleProps {
  message: ChatMessage;
  isMe: boolean;
  onLaunchFullQuiz: (quiz: any) => void;
}

const QUICK_EMOJIS = ['❤️', '🔥', '😂', '👍', '🧠', '⚡'];

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isMe,
  onLaunchFullQuiz,
}) => {
  const { reactToMessage } = useApp();
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  return (
    <div
      className={`group relative flex gap-3 px-2 py-1.5 transition-colors hover:bg-slate-900/40 rounded-xl ${
        isMe ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Author Avatar */}
      <Avatar
        src={message.senderAvatar}
        name={message.senderName}
        size="md"
        role={message.senderRole}
      />

      {/* Bubble Content */}
      <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
        {/* Author Header Info */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-slate-200">
            {message.senderName}
          </span>

          {message.senderRole === 'admin' && (
            <span className="text-[10px] font-semibold text-rose-400">
              Admin
            </span>
          )}
          {message.senderRole === 'moderator' && (
            <span className="text-[10px] font-semibold text-violet-400">
              Mod
            </span>
          )}

          <span className="text-[10px] text-slate-400">{message.timestamp}</span>
        </div>

        {/* Message Body */}
        {message.type === 'quiz' && message.quizData ? (
          <QuizMessage
            quiz={message.quizData}
            onLaunchFullQuiz={() => onLaunchFullQuiz(message.quizData)}
          />
        ) : (
          <div
            className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm break-words ${
              isMe
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_2px_12px_rgba(139,92,246,0.2)]'
                : 'border border-slate-800 bg-slate-900/90 text-slate-200'
            }`}
          >
            {message.content}
          </div>
        )}

        {/* Reactions List */}
        {message.reactions.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {message.reactions.map((r) => (
              <button
                key={r.emoji}
                onClick={() => reactToMessage(message.id, r.emoji)}
                className="flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950/70 px-2 py-0.5 text-xs text-slate-300 hover:border-violet-500/40 hover:bg-slate-900 transition-colors"
                title={`${r.count} réactions`}
              >
                <span>{r.emoji}</span>
                <span className="text-[11px] font-medium text-slate-400">{r.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Hover Action Bar */}
        <div
          className={`absolute top-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 rounded-lg border border-slate-800 bg-[#0B0F19] p-1 shadow-lg ${
            isMe ? 'left-4' : 'right-4'
          }`}
        >
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              title="Ajouter une réaction"
            >
              <Smile className="h-3.5 w-3.5" />
            </button>

            {showEmojiPicker && (
              <div
                className={`absolute top-full z-50 mt-1 flex gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-2xl ${
                  isMe ? 'left-0' : 'right-0'
                }`}
              >
                {QUICK_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      reactToMessage(message.id, emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-slate-800 text-sm hover:scale-110 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
