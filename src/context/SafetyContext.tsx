import React, { createContext, useContext, useEffect, useState } from 'react';

interface SafetyContextType {
  isDisguised: boolean;
  toggleDisguise: () => void;
  quickExit: () => void;
}

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

export function SafetyProvider({ children }: { children: React.ReactNode }) {
  const [isDisguised, setIsDisguised] = useState(false);

  const toggleDisguise = () => {
    setIsDisguised(prev => !prev);
  };

  const quickExit = () => {
    // Replaces browser history so that clicking Back does not reveal SafeVoice
    window.location.replace('https://www.google.com');
  };

  // Keyboard shortcut listener: Escape or Alt + Shift + D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || (e.altKey && e.shiftKey && e.key.toLowerCase() === 'd')) {
        e.preventDefault();
        toggleDisguise();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <SafetyContext.Provider value={{ isDisguised, toggleDisguise, quickExit }}>
      {children}
    </SafetyContext.Provider>
  );
}

export function useSafety() {
  const context = useContext(SafetyContext);
  if (context === undefined) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
}
