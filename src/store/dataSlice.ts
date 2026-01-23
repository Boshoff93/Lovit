import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { videosApi, songsApi, charactersApi, narrativesApi, Character, Narrative } from '../services/api';

// Types
interface Video {
  videoId: string;
  songId?: string;
  status: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  songTitle?: string;
  aspectRatio?: string;
  [key: string]: any;
}

interface Song {
  songId: string;
  title?: string;
  status: string;
  audioUrl?: string;
  [key: string]: any;
}

// State interfaces - simplified, no cache timestamps
interface DataList<T> {
  items: T[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
}

interface DataState {
  videos: DataList<Video>;
  songs: DataList<Song>;
  characters: DataList<Character>;
  narratives: DataList<Narrative>;
}

const initialDataList = <T>(): DataList<T> => ({
  items: [],
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
});

const initialState: DataState = {
  videos: initialDataList<Video>(),
  songs: initialDataList<Song>(),
  characters: initialDataList<Character>(),
  narratives: initialDataList<Narrative>(),
};

// Async thunks - always fetch fresh, let HTTP caching handle it
export const fetchVideos = createAsyncThunk(
  'data/fetchVideos',
  async (
    { userId, page = 1, limit = 20 }: { userId: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await videosApi.getUserVideos(userId, { page, limit });
      return {
        videos: response.data.videos || [],
        totalCount: response.data.pagination?.totalCount || response.data.videos?.length || 0,
        page,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch videos');
    }
  }
);

export const fetchSongs = createAsyncThunk(
  'data/fetchSongs',
  async (
    { userId, page = 1, limit = 20, search, genre, mood }: {
      userId: string;
      page?: number;
      limit?: number;
      search?: string;
      genre?: string;
      mood?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await songsApi.getUserSongs(userId, { page, limit, search, genre, mood });
      return {
        songs: response.data.songs || [],
        totalCount: response.data.pagination?.totalCount || response.data.songs?.length || 0,
        page,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch songs');
    }
  }
);

export const fetchCharacters = createAsyncThunk(
  'data/fetchCharacters',
  async ({ userId }: { userId: string }, { rejectWithValue }) => {
    try {
      const response = await charactersApi.getUserCharacters(userId);
      return {
        characters: response.data.characters || [],
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch characters');
    }
  }
);

export const fetchNarratives = createAsyncThunk(
  'data/fetchNarratives',
  async ({ userId }: { userId: string }, { rejectWithValue }) => {
    try {
      const response = await narrativesApi.getUserNarratives(userId);
      return {
        narratives: response.data.narratives || [],
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch narratives');
    }
  }
);

// Slice
const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    // Clear all data (e.g., on logout)
    clearAllData: (state) => {
      state.videos = initialDataList<Video>();
      state.songs = initialDataList<Song>();
      state.characters = initialDataList<Character>();
      state.narratives = initialDataList<Narrative>();
    },
    // Update a single video (for optimistic updates)
    updateVideo: (state, action: PayloadAction<Video>) => {
      const index = state.videos.items.findIndex(v => v.videoId === action.payload.videoId);
      if (index !== -1) {
        state.videos.items[index] = action.payload;
      }
    },
    // Update a single song (for optimistic updates)
    updateSong: (state, action: PayloadAction<Song>) => {
      const index = state.songs.items.findIndex(s => s.songId === action.payload.songId);
      if (index !== -1) {
        state.songs.items[index] = action.payload;
      }
    },
    // Add a new video (optimistic)
    addVideo: (state, action: PayloadAction<Video>) => {
      state.videos.items.unshift(action.payload);
      state.videos.totalCount += 1;
    },
    // Add a new song (optimistic)
    addSong: (state, action: PayloadAction<Song>) => {
      state.songs.items.unshift(action.payload);
      state.songs.totalCount += 1;
    },
    // Add a new character (optimistic)
    addCharacter: (state, action: PayloadAction<Character>) => {
      state.characters.items.unshift(action.payload);
      state.characters.totalCount += 1;
    },
    // Add a new narrative (optimistic)
    addNarrative: (state, action: PayloadAction<Narrative>) => {
      state.narratives.items.unshift(action.payload);
      state.narratives.totalCount += 1;
    },
    // Remove a video (optimistic)
    removeVideo: (state, action: PayloadAction<string>) => {
      state.videos.items = state.videos.items.filter(v => v.videoId !== action.payload);
      state.videos.totalCount -= 1;
    },
    // Remove a song (optimistic)
    removeSong: (state, action: PayloadAction<string>) => {
      state.songs.items = state.songs.items.filter(s => s.songId !== action.payload);
      state.songs.totalCount -= 1;
    },
    // Remove a character (optimistic)
    removeCharacter: (state, action: PayloadAction<string>) => {
      state.characters.items = state.characters.items.filter(c => c.characterId !== action.payload);
      state.characters.totalCount -= 1;
    },
    // Remove a narrative (optimistic)
    removeNarrative: (state, action: PayloadAction<string>) => {
      state.narratives.items = state.narratives.items.filter(n => n.narrativeId !== action.payload);
      state.narratives.totalCount -= 1;
    },
  },
  extraReducers: (builder) => {
    // Videos
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.videos.isLoading = true;
        state.videos.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.videos.isLoading = false;
        state.videos.items = action.payload.videos;
        state.videos.totalCount = action.payload.totalCount;
        state.videos.currentPage = action.payload.page || 1;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.videos.isLoading = false;
        state.videos.error = action.payload as string;
      });

    // Songs
    builder
      .addCase(fetchSongs.pending, (state) => {
        state.songs.isLoading = true;
        state.songs.error = null;
      })
      .addCase(fetchSongs.fulfilled, (state, action) => {
        state.songs.isLoading = false;
        state.songs.items = action.payload.songs;
        state.songs.totalCount = action.payload.totalCount;
        state.songs.currentPage = action.payload.page || 1;
      })
      .addCase(fetchSongs.rejected, (state, action) => {
        state.songs.isLoading = false;
        state.songs.error = action.payload as string;
      });

    // Characters
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.characters.isLoading = true;
        state.characters.error = null;
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.characters.isLoading = false;
        state.characters.items = action.payload.characters;
        state.characters.totalCount = action.payload.characters.length;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.characters.isLoading = false;
        state.characters.error = action.payload as string;
      });

    // Narratives
    builder
      .addCase(fetchNarratives.pending, (state) => {
        state.narratives.isLoading = true;
        state.narratives.error = null;
      })
      .addCase(fetchNarratives.fulfilled, (state, action) => {
        state.narratives.isLoading = false;
        state.narratives.items = action.payload.narratives;
        state.narratives.totalCount = action.payload.narratives.length;
      })
      .addCase(fetchNarratives.rejected, (state, action) => {
        state.narratives.isLoading = false;
        state.narratives.error = action.payload as string;
      });
  },
});

export const {
  clearAllData,
  updateVideo,
  updateSong,
  addVideo,
  addSong,
  addCharacter,
  addNarrative,
  removeVideo,
  removeSong,
  removeCharacter,
  removeNarrative,
} = dataSlice.actions;

export default dataSlice.reducer;
