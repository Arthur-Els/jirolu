"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

interface WelcomeAudioContextValue {
  isMuted: boolean;
  isPlaying: boolean;
  awaitingGesture: boolean;
  toggleMute: () => void;
  setExternalAudioPlaying: (playing: boolean) => void;
}

const WelcomeAudioContext = createContext<WelcomeAudioContextValue | null>(null);

export function useWelcomeAudio(): WelcomeAudioContextValue {
  const ctx = useContext(WelcomeAudioContext);
  if (!ctx) {
    return {
      isMuted: false,
      isPlaying: false,
      awaitingGesture: false,
      toggleMute: () => {},
      setExternalAudioPlaying: () => {},
    };
  }
  return ctx;
}

const WELCOME_AUDIO_SRC = "/audio/welcome.wav";
const WELCOME_VOLUME = 0.38;

export const WelcomeAudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { locale } = useLanguage();
  const pathname = usePathname();
  const isSoundboardRoute =
    pathname.startsWith("/instrumen") || pathname.startsWith("/soundboard");

  const [isMuted, setIsMuted] = useState(false);
  const [isExternalPlaying, setIsExternalPlaying] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [awaitingGesture, setAwaitingGesture] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldPlay = !isMuted && !isExternalPlaying && !isSoundboardRoute;
  const shouldPlayRef = useRef(shouldPlay);

  useEffect(() => {
    shouldPlayRef.current = shouldPlay;
  }, [shouldPlay]);

  // Inisialisasi elemen audio welcome sekali saat mount
  useEffect(() => {
    const audio = new Audio(WELCOME_AUDIO_SRC);
    audio.loop = true;
    audio.volume = WELCOME_VOLUME;
    audio.preload = "auto";
    audioRef.current = audio;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handlePause);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handlePause);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Sinkronkan status play/pause berdasarkan mute, halaman soundboard, dan contoh lagu
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (shouldPlay) {
      audio
        .play()
        .then(() => {
          setAwaitingGesture(false);
        })
        .catch(() => {
          setAwaitingGesture(true);
        });
    } else {
      audio.pause();
    }
  }, [shouldPlay]);

  // Jika browser memblokir autoplay, putar otomatis pada interaksi pengguna pertama
  useEffect(() => {
    if (!awaitingGesture || !shouldPlay) return;

    const handleFirstGesture = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-welcome-skip]")) return;

      const audio = audioRef.current;
      if (!audio || !shouldPlayRef.current) return;

      audio
        .play()
        .then(() => {
          setAwaitingGesture(false);
        })
        .catch(() => {});
    };

    window.addEventListener("click", handleFirstGesture, { passive: true });
    window.addEventListener("keydown", handleFirstGesture, { passive: true });

    return () => {
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };
  }, [awaitingGesture, shouldPlay]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (nextMuted) {
      audio?.pause();
      setAwaitingGesture(false);
    } else if (audio && !isExternalPlaying && !isSoundboardRoute) {
      audio
        .play()
        .then(() => setAwaitingGesture(false))
        .catch(() => setAwaitingGesture(true));
    }
  }, [isMuted, isExternalPlaying, isSoundboardRoute]);

  const setExternalAudioPlaying = useCallback((playing: boolean) => {
    setIsExternalPlaying(playing);
  }, []);

  const showFloatingButton = !isSoundboardRoute;
  const muteLabel =
    locale === "en"
      ? isMuted
        ? "Unmute audio"
        : "Mute audio"
      : isMuted
        ? "Nyalakan suara"
        : "Matikan suara";

  return (
    <WelcomeAudioContext.Provider
      value={{
        isMuted,
        isPlaying,
        awaitingGesture,
        toggleMute,
        setExternalAudioPlaying,
      }}
    >
      {children}

      {showFloatingButton && (
        <button
          type="button"
          data-welcome-skip="true"
          onClick={toggleMute}
          aria-pressed={isMuted}
          aria-label={muteLabel}
          title={muteLabel}
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-11 h-11 rounded-full border backdrop-blur-md shadow-card flex items-center justify-center motion-safe:transition-colors duration-150 motion-safe:active:scale-95 focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 cursor-pointer ${
            isMuted
              ? "bg-paper-2/80 border-rule text-muted hover:text-ink hover:border-accent/60"
              : "bg-paper-2/90 border-rule text-accent hover:border-accent"
          }`}
        >
          {isMuted ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
          )}
        </button>
      )}
    </WelcomeAudioContext.Provider>
  );
};
