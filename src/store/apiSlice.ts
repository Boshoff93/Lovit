import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Character, Narrative, ScheduledPost } from '../services/api';

// TikTok Analytics types
export interface TikTokVideo {
  id: string;
  title: string;
  create_time: number;
  cover_image_url: string;
  share_url: string;
  duration: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  view_count: number;
}

export interface TikTokSummary {
  totalPosts: number;
  totals: { views: number; likes: number; comments: number; shares: number };
  averages: { views: number; likes: number; comments: number; shares: number };
  lastWeek: { views: number; likes: number; comments: number; shares: number; posts: number };
  lastMonth: { views: number; likes: number; comments: number; shares: number; posts: number };
  allTime: { views: number; likes: number; comments: number; shares: number; posts: number };
  topByViews: Array<{ id: string; title: string; views: number; likes: number; shares: number; url: string }>;
  topByEngagement: Array<{ id: string; title: string; views: number; likes: number; comments: number; shares: number; url: string }>;
}

export interface TikTokTrendBucket {
  date: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  posts: number;
}

export interface TikTokAccountStats {
  displayName: string;
  avatarUrl: string;
  followerCount: number;
  followingCount: number;
  likesCount: number;
  videoCount: number;
}

// Slideshow type
export interface Slideshow {
  slideshowId: string;
  userId: string;
  title: string;
  description: string;
  style: string;
  slideCount: number;
  aspectRatio: '9:16' | '4:5';
  brand: string;
  hook?: string;
  ctaText?: string;
  tokenCost: number;
  imageKeys: string[];
  imageUrls: string[];
  captions: string[];
  hashtags: string[];
  characterIds?: string[];
  existingAssetKeys?: string[];
  status: 'generating' | 'ready' | 'failed';
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

// Types - keep them flexible to allow any server-returned properties
export interface Song {
  songId: string;
  songTitle: string;
  genre: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  mood?: string;
  actualDuration?: number;
  progress?: number;
  progressMessage?: string;
  audioUrl?: string;
  coverUrl?: string;
  lyrics?: string;
  lyricsWithTags?: string;
  songPrompt?: string;
  language?: string;
  customInstructions?: string;
  creativity?: number;
  songLength?: 'short' | 'standard';
  isUserUpload?: boolean;
  artist?: string;
  isPremium?: boolean;
  [key: string]: any;
}

export interface Video {
  videoId: string;
  songId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'interrupted';
  createdAt: string;
  songTitle?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  progress?: number;
  progressMessage?: string;
  queuePosition?: number;
  duration?: number;
  aspectRatio?: 'portrait' | 'landscape';
  videoCategory?: 'app' | 'place' | 'product' | 'music';
  videoType?: string;
  [key: string]: any;
}

interface VideosResponse {
  videos: Video[];
  pagination?: {
    totalCount: number;
    page: number;
    limit: number;
  };
}

interface SongsResponse {
  songs: Song[];
  pagination?: {
    totalCount: number;
    page: number;
    limit: number;
  };
}

interface CharactersResponse {
  characters: Character[];
}

interface NarrativesResponse {
  narratives: Narrative[];
}

// Base URL
const API_BASE_URL = 'https://api.gruvimusic.com';

// RTK Query API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // Tag types for cache invalidation
  tagTypes: ['Videos', 'Songs', 'Characters', 'Narratives', 'SocialConnections', 'ScheduledPosts', 'Slideshows', 'TikTokVideos', 'TikTokSummary', 'TikTokTrends', 'TikTokAccountStats'],
  endpoints: (builder) => ({
    // Videos
    getUserVideos: builder.query<
      { videos: Video[]; totalCount: number; page: number },
      { userId: string; page?: number; limit?: number }
    >({
      query: ({ userId, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        return `/api/gruvi/videos/${userId}?${params.toString()}`;
      },
      transformResponse: (response: VideosResponse, _meta, arg) => ({
        videos: response.videos || [],
        totalCount: response.pagination?.totalCount || response.videos?.length || 0,
        page: arg.page || 1,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.videos.map(({ videoId }) => ({ type: 'Videos' as const, id: videoId })),
              { type: 'Videos', id: 'LIST' },
            ]
          : [{ type: 'Videos', id: 'LIST' }],
    }),

    // Songs
    getUserSongs: builder.query<
      { songs: Song[]; totalCount: number; page: number },
      { userId: string; page?: number; limit?: number; search?: string; genre?: string; mood?: string }
    >({
      query: ({ userId, page = 1, limit = 20, search, genre, mood }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (search) params.append('search', search);
        if (genre) params.append('genre', genre);
        if (mood) params.append('mood', mood);
        return `/api/gruvi/songs/${userId}?${params.toString()}`;
      },
      transformResponse: (response: SongsResponse, _meta, arg) => ({
        songs: response.songs || [],
        totalCount: response.pagination?.totalCount || response.songs?.length || 0,
        page: arg.page || 1,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.songs.map(({ songId }) => ({ type: 'Songs' as const, id: songId })),
              { type: 'Songs', id: 'LIST' },
            ]
          : [{ type: 'Songs', id: 'LIST' }],
    }),

    // Characters
    getUserCharacters: builder.query<{ characters: Character[] }, { userId: string }>({
      query: ({ userId }) => `/api/gruvi/characters/${userId}`,
      transformResponse: (response: CharactersResponse) => ({
        characters: response.characters || [],
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.characters.map(({ characterId }) => ({ type: 'Characters' as const, id: characterId })),
              { type: 'Characters', id: 'LIST' },
            ]
          : [{ type: 'Characters', id: 'LIST' }],
    }),

    // Narratives
    getUserNarratives: builder.query<{ narratives: Narrative[] }, { userId: string }>({
      query: ({ userId }) => `/api/gruvi/narratives/${userId}`,
      transformResponse: (response: NarrativesResponse) => ({
        narratives: response.narratives || [],
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.narratives.map(({ narrativeId }) => ({ type: 'Narratives' as const, id: narrativeId })),
              { type: 'Narratives', id: 'LIST' },
            ]
          : [{ type: 'Narratives', id: 'LIST' }],
    }),

    // Delete mutations
    deleteCharacter: builder.mutation<void, { userId: string; characterId: string }>({
      query: ({ userId, characterId }) => ({
        url: `/api/gruvi/characters/${userId}/${characterId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { characterId }) => [
        { type: 'Characters', id: characterId },
        { type: 'Characters', id: 'LIST' },
      ],
    }),

    deleteNarrative: builder.mutation<void, { userId: string; narrativeId: string }>({
      query: ({ userId, narrativeId }) => ({
        url: `/api/gruvi/narratives/${userId}/${narrativeId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { narrativeId }) => [
        { type: 'Narratives', id: narrativeId },
        { type: 'Narratives', id: 'LIST' },
      ],
    }),

    deleteVideo: builder.mutation<void, { userId: string; videoId: string }>({
      query: ({ userId, videoId }) => ({
        url: `/api/gruvi/videos/${userId}/${videoId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { videoId }) => [
        { type: 'Videos', id: videoId },
        { type: 'Videos', id: 'LIST' },
      ],
    }),

    deleteSong: builder.mutation<void, { userId: string; songId: string }>({
      query: ({ userId, songId }) => ({
        url: `/api/gruvi/songs/${userId}/${songId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { songId }) => [
        { type: 'Songs', id: songId },
        { type: 'Songs', id: 'LIST' },
      ],
    }),

    // Social Accounts (multi-account)
    getSocialAccounts: builder.query<
      { accounts: Array<{ accountId: string; platform: string; accountName?: string; username?: string; avatarUrl?: string; connectedAt?: string }> },
      { userId: string }
    >({
      query: ({ userId }) => `/api/gruvi/social-accounts?userId=${userId}`,
      providesTags: ['SocialConnections'],
    }),

    // Social Media Connection Status (legacy per-platform queries)
    getYouTubeStatus: builder.query<
      { connected: boolean; channelInfo?: { channelTitle?: string; channelId?: string }; accounts?: Array<{ accountId: string; channelTitle?: string; channelId?: string; avatarUrl?: string }> },
      { userId: string }
    >({
      query: ({ userId }) => `/api/gruvi/youtube/status?userId=${userId}`,
      providesTags: [{ type: 'SocialConnections', id: 'youtube' }],
    }),

    getTikTokStatus: builder.query<
      { connected: boolean; username?: string; avatarUrl?: string; accounts?: Array<{ accountId: string; username?: string; avatarUrl?: string }> },
      { userId: string }
    >({
      query: ({ userId }) => `/api/gruvi/tiktok/status?userId=${userId}`,
      providesTags: [{ type: 'SocialConnections', id: 'tiktok' }],
    }),

    getInstagramStatus: builder.query<
      { connected: boolean; username?: string; profilePictureUrl?: string; accounts?: Array<{ accountId: string; username?: string; name?: string; profilePictureUrl?: string }> },
      { userId: string }
    >({
      query: ({ userId }) => `/api/gruvi/instagram/status?userId=${userId}`,
      providesTags: [{ type: 'SocialConnections', id: 'instagram' }],
    }),

    getFacebookStatus: builder.query<
      { connected: boolean; pageName?: string; pageId?: string; accounts?: Array<{ accountId: string; pageName?: string; pageId?: string }> },
      { userId: string }
    >({
      query: ({ userId }) => `/api/gruvi/facebook/status?userId=${userId}`,
      providesTags: [{ type: 'SocialConnections', id: 'facebook' }],
    }),

    getLinkedInStatus: builder.query<
      { connected: boolean; name?: string; profilePictureUrl?: string; accounts?: Array<{ accountId: string; name?: string; profilePictureUrl?: string }> },
      { userId: string }
    >({
      query: ({ userId }) => `/api/gruvi/linkedin/status?userId=${userId}`,
      providesTags: [{ type: 'SocialConnections', id: 'linkedin' }],
    }),

    getTwitterStatus: builder.query<
      { connected: boolean; username?: string; name?: string; profileImageUrl?: string; accounts?: Array<{ accountId: string; username?: string; name?: string; profileImageUrl?: string }> },
      { userId: string }
    >({
      query: ({ userId }) => `/api/gruvi/twitter/status?userId=${userId}`,
      providesTags: [{ type: 'SocialConnections', id: 'twitter' }],
    }),

    // Slideshows
    getSlideshows: builder.query<{ slideshows: Slideshow[] }, void>({
      query: () => `/api/gruvi/slideshows`,
      providesTags: (result) =>
        result
          ? [
              ...result.slideshows.map(({ slideshowId }) => ({ type: 'Slideshows' as const, id: slideshowId })),
              { type: 'Slideshows', id: 'LIST' },
            ]
          : [{ type: 'Slideshows', id: 'LIST' }],
    }),

    getSlideshow: builder.query<{ slideshow: Slideshow }, string>({
      query: (slideshowId) => `/api/gruvi/slideshows/${slideshowId}`,
      providesTags: (_result, _error, slideshowId) => [{ type: 'Slideshows', id: slideshowId }],
    }),

    deleteSlideshow: builder.mutation<void, string>({
      query: (slideshowId) => ({
        url: `/api/gruvi/slideshows/${slideshowId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, slideshowId) => [
        { type: 'Slideshows', id: slideshowId },
        { type: 'Slideshows', id: 'LIST' },
      ],
    }),

    // Scheduled Posts
    getScheduledPosts: builder.query<
      { scheduledPosts: ScheduledPost[]; schedulingLimits?: { used: number; limit: number; remaining: number; tier: string } },
      void
    >({
      query: () => `/api/gruvi/scheduled-posts`,
      providesTags: ['ScheduledPosts'],
    }),

    // TikTok Analytics
    getTikTokVideos: builder.query<
      { videos: TikTokVideo[]; totalCount: number },
      { userId: string; accountId?: string }
    >({
      query: ({ userId, accountId }) => {
        const params = new URLSearchParams({ userId });
        if (accountId) params.append('accountId', accountId);
        return `/api/gruvi/tiktok/videos?${params.toString()}`;
      },
      providesTags: ['TikTokVideos'],
    }),

    getTikTokSummary: builder.query<
      TikTokSummary,
      { userId: string; accountId?: string }
    >({
      query: ({ userId, accountId }) => {
        const params = new URLSearchParams({ userId });
        if (accountId) params.append('accountId', accountId);
        return `/api/gruvi/tiktok/analytics/summary?${params.toString()}`;
      },
      providesTags: ['TikTokSummary'],
    }),

    getTikTokTrends: builder.query<
      { period: string; trends: TikTokTrendBucket[]; totalBuckets: number },
      { userId: string; accountId?: string; period?: 'daily' | 'weekly' | 'monthly' }
    >({
      query: ({ userId, accountId, period = 'daily' }) => {
        const params = new URLSearchParams({ userId, period });
        if (accountId) params.append('accountId', accountId);
        return `/api/gruvi/tiktok/analytics/trends?${params.toString()}`;
      },
      providesTags: ['TikTokTrends'],
    }),

    getTikTokAccountStats: builder.query<
      TikTokAccountStats,
      { userId: string; accountId?: string }
    >({
      query: ({ userId, accountId }) => {
        const params = new URLSearchParams({ userId });
        if (accountId) params.append('accountId', accountId);
        return `/api/gruvi/tiktok/account/stats?${params.toString()}`;
      },
      providesTags: ['TikTokAccountStats'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetUserVideosQuery,
  useGetUserSongsQuery,
  useGetUserCharactersQuery,
  useGetUserNarrativesQuery,
  useDeleteCharacterMutation,
  useDeleteNarrativeMutation,
  useDeleteVideoMutation,
  useDeleteSongMutation,
  // Slideshows
  useGetSlideshowsQuery,
  useGetSlideshowQuery,
  useDeleteSlideshowMutation,
  // Social Media
  useGetSocialAccountsQuery,
  useGetYouTubeStatusQuery,
  useGetTikTokStatusQuery,
  useGetInstagramStatusQuery,
  useGetFacebookStatusQuery,
  useGetLinkedInStatusQuery,
  useGetTwitterStatusQuery,
  // Scheduled Posts
  useGetScheduledPostsQuery,
  // TikTok Analytics
  useGetTikTokVideosQuery,
  useGetTikTokSummaryQuery,
  useGetTikTokTrendsQuery,
  useGetTikTokAccountStatsQuery,
} = apiSlice;
