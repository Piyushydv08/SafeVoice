import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";

export default function QuickExit() {
  // Weather.com or Google are commonly used benign exit sites
  const exitSite = "https://www.google.com";
  const clicksRef = useRef<number[]>([]);

  const handleExit = () => {
    // replace() prevents the SafeVoice website from appearing in the back button history
    window.location.replace(exitSite);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const now = Date.now();
        clicksRef.current.push(now);
        
        // Keep only clicks within the last 2 seconds (2000ms)
        clicksRef.current = clicksRef.current.filter((time) => now - time <= 2000);
        
        // Trigger exit on 3 quick presses
        if (clicksRef.current.length >= 3) {
          handleExit();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="fixed bottom-5 left-5 sm:bottom-8 sm:left-8 z-[9999]">
      <button
        onClick={handleExit}
        className="group relative flex items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-3 sm:px-5 sm:py-3.5 font-extrabold text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all duration-300 hover:bg-red-700 hover:shadow-[0_0_25px_rgba(220,38,38,0.8)] hover:scale-105 active:scale-95 border-2 border-red-400/50"
        aria-label="Quick Exit (Press Escape 3 times)"
        title="Quick Exit: Press Escape 3 times"
      >
        <AlertTriangle className="h-6 w-6 sm:h-7 sm:w-7 animate-pulse group-hover:animate-none" strokeWidth={2.5} />
        <span className="tracking-wider text-sm sm:text-base whitespace-nowrap">QUICK EXIT</span>
        
        {/* Tooltip for desktop */}
        <div className="absolute -top-12 left-0 hidden w-max rounded-md bg-gray-900 px-3 py-2 text-xs font-semibold text-white shadow-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block dark:bg-gray-100 dark:text-gray-900 pointer-events-none">
          Press <kbd className="rounded bg-gray-700 px-1.5 py-0.5 font-mono text-gray-100 dark:bg-gray-300 dark:text-gray-900 border border-gray-600 dark:border-gray-400">Esc</kbd> 3 times
        </div>
      </button>
    </div>
  );
}
