import React from 'react';
import { Heart, Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  isFading: boolean;
}

export function LoadingScreen({ isFading }: LoadingScreenProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fff8fb] dark:bg-slate-950 transition-opacity duration-300 ease-in-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <style>{`
        @keyframes premiumPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 4px 20px -2px rgba(236, 72, 153, 0.1); }
          50% { transform: scale(1.04); box-shadow: 0 10px 25px -2px rgba(236, 72, 153, 0.25); }
        }
        .animate-premium-pulse {
          animation: premiumPulse 2.5s ease-in-out infinite;
        }
      `}</style>
      
      <div className="relative flex flex-col items-center">
        {/* Subtle Glow effect behind logo */}
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-pink-300/30 blur-3xl dark:bg-pink-500/20" />
        
        {/* Premium subtle scale/pulse container (removed bounce) */}
        <div className="animate-premium-pulse relative flex h-20 w-20 items-center justify-center rounded-2xl border border-pink-100/80 bg-white/80 backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
          <Heart className="h-10 w-10 text-pink-500 fill-pink-500/90 drop-shadow-sm" />
        </div>
        
        <h1 className="mt-8 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          SafeVoice
        </h1>
        
        {/* Tagline */}
        <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          Your story. Your strength.
        </p>

        {/* Minimal Spinner */}
        <div className="mt-10">
          <Loader2 className="h-5 w-5 animate-spin text-pink-400/80 dark:text-pink-500/80" />
        </div>
      </div>
    </div>
  );
}
