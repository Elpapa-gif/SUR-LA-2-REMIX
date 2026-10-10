import React, { useState } from 'react';
import { ShoppingBag, Coins, Check, Sparkles, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MarketplaceItem } from '../../types';

export const MarketplaceSection: React.FC = () => {
  const { marketplaceItems, currentUser, buyMarketplaceItem } = useApp();
  const [filter, setFilter] = useState<'all' | 'badge' | 'title' | 'boost' | 'theme'>('all');
  const [purchaseMsg, setPurchaseMsg] = useState<{ text: string; success: boolean } | null>(null);

  const filteredItems = marketplaceItems.filter((item) =>
    filter === 'all' ? true : item.category === filter
  );

  const handleBuy = (item: MarketplaceItem) => {
    if (item.unlocked) return;
    const ok = buyMarketplaceItem(item.id);
    if (ok) {
      setPurchaseMsg({
        text: `Félicitations ! Vous avez débloqué "${item.name}".`,
        success: true,
      });
    } else {
      setPurchaseMsg({
        text: `Pièces insuffisantes pour acheter "${item.name}" (${item.price} 🪙 nécessaires).`,
        success: false,
      });
    }

    setTimeout(() => {
      setPurchaseMsg(null);
    }, 3500);
  };

  const rarityColor = {
    common: 'text-slate-400 border-slate-700',
    rare: 'text-cyan-400 border-cyan-500/30',
    epic: 'text-violet-400 border-violet-500/30',
    legendary: 'text-amber-400 border-amber-500/30',
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0B0F19]/90 p-5 sm:p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/30">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Boutique de Récompenses (Marketplace)
            </h3>
            <p className="text-xs text-slate-400">
              Débloquez des badges exclusifs, auras néon et boosters d'XP
            </p>
          </div>
        </div>

        {/* Current user coins balance */}
        <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-cyan-500/30 px-3.5 py-1.5 text-xs font-bold text-cyan-400 shadow-sm">
          <Coins className="h-4 w-4" />
          <span>{currentUser.coins} Pièces disponibles</span>
        </div>
      </div>

      {/* Notification alert banner */}
      {purchaseMsg && (
        <div
          className={`mb-4 flex items-center gap-2 rounded-xl border p-3 text-xs font-semibold animate-in fade-in ${
            purchaseMsg.success
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
          }`}
        >
          {purchaseMsg.success ? (
            <Check className="h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          )}
          <span>{purchaseMsg.text}</span>
        </div>
      )}

      {/* Category filters */}
      <div className="mb-5 flex flex-wrap gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
        {[
          { key: 'all', label: 'Tout voir' },
          { key: 'badge', label: 'Badges' },
          { key: 'title', label: 'Titres' },
          { key: 'boost', label: 'Boosters' },
          { key: 'theme', label: 'Thèmes' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === tab.key
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredItems.map((item) => {
          const canAfford = currentUser.coins >= item.price;
          return (
            <div
              key={item.id}
              className={`flex flex-col justify-between rounded-2xl border p-4 transition-all ${
                item.unlocked
                  ? 'border-emerald-500/20 bg-emerald-950/10'
                  : 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-3xl">{item.icon}</span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      rarityColor[item.rarity]
                    }`}
                  >
                    {item.rarity}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-1">{item.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Coins className="h-4 w-4" />
                  <span>{item.price} pièces</span>
                </div>

                {item.unlocked ? (
                  <span className="flex items-center gap-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-400">
                    <Check className="h-3.5 w-3.5" />
                    <span>Débloqué</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={!canAfford}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                      canAfford
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:brightness-110 active:scale-95 shadow-md'
                        : 'border border-slate-800 bg-slate-900 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Débloquer
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
