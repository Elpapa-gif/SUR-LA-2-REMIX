import React from 'react';

interface AvatarProps {
  src: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  moodEmoji?: string;
  moodColor?: string;
  statusOnline?: boolean;
  role?: 'admin' | 'moderator' | 'member';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  moodEmoji,
  moodColor,
  statusOnline,
  role,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  }[size];

  const ringClass =
    role === 'admin'
      ? 'ring-2 ring-rose-500/80 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
      : role === 'moderator'
      ? 'ring-2 ring-violet-500/80 shadow-[0_0_10px_rgba(139,92,246,0.3)]'
      : 'ring-1 ring-slate-700/60';

  return (
    <div className={`relative inline-block select-none shrink-0 ${className}`}>
      <div
        className={`relative overflow-hidden rounded-xl bg-slate-800 ${sizeClasses} ${ringClass}`}
      >
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Mood Emoji or status dot */}
      {moodEmoji ? (
        <span
          className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 border border-slate-700 text-[11px] shadow-sm"
          title={`Humeur actuelle : ${moodEmoji}`}
        >
          {moodEmoji}
        </span>
      ) : statusOnline !== undefined ? (
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-950 ${
            statusOnline ? 'bg-emerald-500' : 'bg-slate-500'
          }`}
        />
      ) : moodColor ? (
        <span
          className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-slate-950"
          style={{ backgroundColor: moodColor }}
        />
      ) : null}
    </div>
  );
};
