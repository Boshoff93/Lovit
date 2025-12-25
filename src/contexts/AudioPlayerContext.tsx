import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

export interface Song {
  songId: string;
  songTitle: string;
  genre: string;
  audioUrl?: string;
  status: string;
  createdAt: string;
  duration?: number;
  lyrics?: string;
  lyricsWithTags?: string;
}

interface AudioPlayerContextType {
  // Current song state
  currentSong: Song | null;
  songs: Song[];
  isPlaying: boolean;
  progress: number;
  duration: number;
  
  // Actions
  playSong: (song: Song, allSongs?: Song[]) => void;
  pauseSong: () => void;
  togglePlayPause: () => void;
  nextSong: () => void;
  previousSong: () => void;
  seekTo: (time: number) => void;
  closePlayer: () => void;
  setSongsList: (songs: Song[]) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};

interface AudioPlayerProviderProps {
  children: React.ReactNode;
}

export const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSongRef = useRef<Song | null>(null);
  const songsRef = useRef<Song[]>([]);
  
  // Keep refs in sync with state for use in callbacks
  useEffect(() => {
    currentSongRef.current = currentSong;
  }, [currentSong]);
  
  useEffect(() => {
    songsRef.current = songs;
  }, [songs]);

  // Safe play function that handles the interrupted play() promise
  const safePlay = useCallback(async (audio: HTMLAudioElement) => {
    try {
      await audio.play();
    } catch (error: any) {
      // Ignore AbortError - this happens when play() is interrupted by pause() or load()
      if (error.name !== 'AbortError') {
        console.error('Audio play error:', error);
      }
    }
  }, []);

  // Play next song - using refs to avoid stale closure
  const playNextSong = useCallback(() => {
    const current = currentSongRef.current;
    const allSongs = songsRef.current;
    
    if (!current || allSongs.length === 0) return;
    
    const completedSongs = allSongs.filter(s => s.status === 'completed' && s.audioUrl);
    const currentIndex = completedSongs.findIndex(s => s.songId === current.songId);
    
    if (currentIndex >= 0 && currentIndex < completedSongs.length - 1) {
      const next = completedSongs[currentIndex + 1];
      playSongInternal(next);
    } else if (completedSongs.length > 0) {
      // Loop back to first song
      playSongInternal(completedSongs[0]);
    }
  }, []);

  // Internal play function
  const playSongInternal = useCallback((song: Song) => {
    if (!audioRef.current || !song.audioUrl) return;
    
    const audio = audioRef.current;
    const current = currentSongRef.current;
    
    if (current?.songId === song.songId) {
      // Same song - toggle play/pause
      if (audio.paused) {
        safePlay(audio);
      } else {
        audio.pause();
      }
    } else {
      // New song - pause first, then load and play
      audio.pause();
      setCurrentSong(song);
      setProgress(0);
      setDuration(0);
      audio.src = song.audioUrl;
      audio.load();
      safePlay(audio);
    }
  }, [safePlay]);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      // Auto play next song
      playNextSong();
    };
    
    const handlePlay = () => {
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.pause();
      audio.src = '';
    };
  }, [playNextSong]);

  const playSong = useCallback((song: Song, allSongs?: Song[]) => {
    if (allSongs) {
      setSongs(allSongs);
      songsRef.current = allSongs;
    }
    playSongInternal(song);
  }, [playSongInternal]);

  const pauseSong = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !currentSongRef.current) return;
    
    if (audioRef.current.paused) {
      safePlay(audioRef.current);
    } else {
      audioRef.current.pause();
    }
  }, [safePlay]);

  const nextSong = useCallback(() => {
    playNextSong();
  }, [playNextSong]);

  const previousSong = useCallback(() => {
    const current = currentSongRef.current;
    const allSongs = songsRef.current;
    
    if (!current || allSongs.length === 0) return;
    
    const completedSongs = allSongs.filter(s => s.status === 'completed' && s.audioUrl);
    const currentIndex = completedSongs.findIndex(s => s.songId === current.songId);
    
    if (currentIndex > 0) {
      const prev = completedSongs[currentIndex - 1];
      playSongInternal(prev);
    } else if (completedSongs.length > 0) {
      // Loop back to last song
      playSongInternal(completedSongs[completedSongs.length - 1]);
    }
  }, [playSongInternal]);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const closePlayer = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setCurrentSong(null);
    setProgress(0);
    setDuration(0);
    setIsPlaying(false);
  }, []);

  const setSongsList = useCallback((newSongs: Song[]) => {
    setSongs(newSongs);
    songsRef.current = newSongs;
  }, []);

  const value: AudioPlayerContextType = {
    currentSong,
    songs,
    isPlaying,
    progress,
    duration,
    playSong,
    pauseSong,
    togglePlayPause,
    nextSong,
    previousSong,
    seekTo,
    closePlayer,
    setSongsList,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};
