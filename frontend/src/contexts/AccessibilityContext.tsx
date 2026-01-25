import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  audioFeedback: boolean;
  screenReader: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  playClickSound: () => void;
  announceText: (text: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 100,
    highContrast: false,
    audioFeedback: false,
    screenReader: false,
  });

  // Audio context for sound effects
  let audioContext: AudioContext | null = null;

  const initAudioContext = () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext;
  };

  const playClickSound = () => {
    if (!settings.audioFeedback) return;
    
    try {
      const ctx = initAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);
    } catch (error) {
      console.log('Audio feedback not available');
    }
  };

  const announceText = (text: string) => {
    if (!settings.screenReader) return;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.2;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    // Apply font size to root element
    if (newSettings.fontSize !== undefined) {
      document.documentElement.style.fontSize = `${newSettings.fontSize}%`;
    }
    
    // Apply high contrast styles
    if (newSettings.highContrast !== undefined) {
      if (newSettings.highContrast) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }
    }

    // Announce setting change
    if (newSettings.fontSize !== undefined) {
      announceText(`Font size changed to ${newSettings.fontSize} percent`);
    }
    if (newSettings.audioFeedback !== undefined) {
      announceText(newSettings.audioFeedback ? 'Audio feedback enabled' : 'Audio feedback disabled');
    }
  };

  return (
    <AccessibilityContext.Provider value={{ 
      settings, 
      updateSettings, 
      playClickSound, 
      announceText 
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};