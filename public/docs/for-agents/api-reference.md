# Gruvi API Reference

Complete API documentation for AI agents and developers.

## Base URL

```
Production: https://api.gruvimusic.com/gruvi
```

## Authentication

All requests require a Bearer token:

```
Authorization: Bearer gruvi_agent_xxxxxxxxxxxx
```

Get your Agent Key from [Account Settings](https://agentgruvi.com/account).

---

## Content Creation APIs

### Create Music (Song Generation)

Generate original AI music with lyrics.

```http
POST /songs/generate
```

**Request Body:**
```json
{
  "userId": "user_123",
  "prompt": "An upbeat pop song about summer adventures",
  "genre": "pop",
  "mood": "happy",
  "duration": "short",
  "premium": false
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | string | Yes | User ID |
| `prompt` | string | Yes | Song description |
| `genre` | string | No | Music genre (pop, rock, hip-hop, etc.) |
| `mood` | string | No | Emotional tone (happy, sad, energetic, etc.) |
| `duration` | string | No | `"short"` (30-90s) or `"long"` (90-120s) |
| `premium` | boolean | No | Enable premium generation (50 tokens/30s) |
| `trackDuration` | number | No | Premium only: exact duration in seconds (30-180) |

**Response:**
```json
{
  "success": true,
  "songId": "song_abc123",
  "status": "processing",
  "message": "Song generation started"
}
```

**Token Cost:**
- Standard short: 25 tokens
- Standard long: 50 tokens
- Premium: 50 tokens per 30 seconds

---

### Create Voiceover (Narrative Generation)

Generate AI voiceovers with different personalities.

```http
POST /narratives/{userId}
```

**Request Body:**
```json
{
  "prompt": "Welcome to our product demo. Today we'll show you...",
  "voiceId": "kristen",
  "title": "Product Demo Intro"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | Yes | Text to convert to speech |
| `voiceId` | string | Yes | Voice personality ID (see voice list) |
| `title` | string | No | Name for the narrative |

**Available Voices:**

| Voice ID | Personality | Best For |
|----------|-------------|----------|
| `kristen` | Energetic female | Social media, UGC |
| `gracie` | Valley girl influencer | TikTok, lifestyle |
| `nathan` | Energetic British male | Social media |
| `jake` | Deep, bold male | Product intros |
| `annie` | Professional female | Corporate content |
| `albus` | Friendly grandpa | Storytelling |
| `beth` | English granny | Narration |
| `fiona` | Irish female | Character voices |
| `arthur` | Heroic male | Epic content |

**Response:**
```json
{
  "success": true,
  "narrativeId": "narr_xyz789",
  "status": "processing"
}
```

**Token Cost:** 25 tokens (flat rate)

---

### List Available Voices

```http
GET /narratives/voices
```

**Response:**
```json
{
  "voices": [
    {
      "id": "kristen",
      "name": "Kristen",
      "description": "Energetic social media narrator",
      "premium": false
    }
  ]
}
```

---

### Create Video

Generate AI videos from songs, voiceovers, or prompts.

```http
POST /videos/generate
```

**Request Body (Music Video):**
```json
{
  "userId": "user_123",
  "videoType": "music",
  "songId": "song_abc123",
  "style": "cinematic",
  "aspectRatio": "9:16"
}
```

**Request Body (Voiceover Video):**
```json
{
  "userId": "user_123",
  "videoType": "voiceover",
  "narrativeId": "narr_xyz789",
  "style": "professional",
  "aspectRatio": "9:16"
}
```

**Request Body (UGC Video):**
```json
{
  "userId": "user_123",
  "videoType": "ugc",
  "prompt": "Excited female creator unboxing a new smartphone",
  "voiceChange": true,
  "voiceId": "gracie",
  "aspectRatio": "9:16"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | string | Yes | User ID |
| `videoType` | string | Yes | `"music"`, `"voiceover"`, `"ugc"`, `"cinematic"` |
| `songId` | string | Conditional | Required for music videos |
| `narrativeId` | string | Conditional | Required for voiceover videos |
| `prompt` | string | Conditional | Required for UGC videos |
| `style` | string | No | Visual style preset |
| `aspectRatio` | string | No | `"9:16"`, `"16:9"`, `"1:1"` |
| `voiceChange` | boolean | No | Enable AI voice change (UGC) |
| `voiceId` | string | No | Voice ID for voice change |

**Video Styles:**
- `cinematic` - Film-like quality
- `professional` - Clean, corporate
- `energetic` - Fast-paced, dynamic
- `minimal` - Simple, elegant
- `retro` - Vintage aesthetic

**Response:**
```json
{
  "success": true,
  "videoId": "vid_def456",
  "status": "processing",
  "estimatedTime": 120
}
```

**Token Cost:** 50 tokens per second of video

---

### Create UGC Video (Dedicated Endpoint)

Best for prompt-based UGC content with optional voice change.

```http
POST /videos/generate
```

**Request Body:**
```json
{
  "userId": "user_123",
  "videoType": "ugc",
  "prompt": "Young woman excitedly trying on new sneakers, showing them to camera, bright bedroom, natural lighting",
  "voiceChange": true,
  "voiceId": "gracie",
  "duration": 15,
  "aspectRatio": "9:16"
}
```

**UGC Prompt Tips:**
- Be specific about the creator's appearance and emotion
- Describe the setting and lighting
- Include the product interaction
- Specify camera angles or movements

**Token Cost:** 50 tokens per 5 seconds

---

### Character Swap (AI Swap Studio)

Replace characters in existing videos using Kling model.

```http
POST /swap-studio/create
```

**Request Body:**
```json
{
  "userId": "user_123",
  "sourceVideoId": "vid_source123",
  "swapMode": "character",
  "referenceCharacterId": "char_abc",
  "followMode": "video"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | string | Yes | User ID |
| `sourceVideoId` | string | Yes | Video to transform |
| `swapMode` | string | Yes | `"character"`, `"character_environment"`, `"custom_prompt"` |
| `referenceCharacterId` | string | Conditional | Character to swap in |
| `customPrompt` | string | Conditional | For custom_prompt mode |
| `followMode` | string | No | `"video"` or `"reference_image"` |
| `style` | string | No | Visual style to apply |

**Swap Modes:**
- `character` - Replace person with different character
- `character_environment` - Replace person and background
- `custom_prompt` - Transform based on text prompt

**Response:**
```json
{
  "success": true,
  "swapId": "swap_ghi789",
  "status": "processing"
}
```

**Token Cost:** 50 tokens per second

---

### Create AI Asset

Create reusable AI characters, products, places, or app assets.

```http
POST /characters
```

**Request Body (Human Character):**
```json
{
  "userId": "user_123",
  "name": "Brand Mascot",
  "type": "human",
  "prompt": "Friendly 30-year-old woman with brown hair, professional attire, warm smile",
  "images": ["data:image/jpeg;base64,..."]
}
```

**Request Body (Product Asset):**
```json
{
  "userId": "user_123",
  "name": "Product Shot",
  "type": "product",
  "prompt": "Premium wireless earbuds in white, sleek modern design",
  "images": ["data:image/jpeg;base64,..."]
}
```

**Asset Types:**

| Type | Description | Use Case |
|------|-------------|----------|
| `human` | Human character | UGC, testimonials |
| `non_human` | Non-human character | Mascots, animated |
| `product` | Product showcase | E-commerce, demos |
| `place` | Location/setting | Backgrounds |
| `app` | App screenshots | App showcase videos |

**Response:**
```json
{
  "success": true,
  "characterId": "char_abc123",
  "status": "ready"
}
```

**Token Cost:** Free (included in plan)

---

### App Showcase Video

Create promotional videos from app screenshots.

```http
POST /videos/generate
```

**Request Body:**
```json
{
  "userId": "user_123",
  "videoType": "app_showcase",
  "appAssetId": "char_app123",
  "style": "modern",
  "voiceoverId": "narr_xyz789",
  "aspectRatio": "9:16"
}
```

**Token Cost:** 50 tokens per second

---

## Content Management APIs

### List Songs

```http
GET /songs/{userId}
```

**Response:**
```json
{
  "songs": [
    {
      "songId": "song_abc123",
      "title": "Summer Vibes",
      "status": "completed",
      "duration": 45,
      "audioUrl": "https://...",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Get Song Details

```http
GET /songs/{userId}/{songId}
```

---

### List Videos

```http
GET /videos/{userId}
```

**Response:**
```json
{
  "videos": [
    {
      "videoId": "vid_def456",
      "title": "Product Demo",
      "status": "completed",
      "duration": 30,
      "videoUrl": "https://...",
      "thumbnailUrl": "https://...",
      "createdAt": "2024-01-15T11:00:00Z"
    }
  ]
}
```

---

### Get Video Details

```http
GET /videos/{userId}/{videoId}
```

---

### Get Video Status

Check processing status of a video.

```http
GET /videos/{userId}/{videoId}/status
```

**Response:**
```json
{
  "status": "processing",
  "progress": 65,
  "estimatedTimeRemaining": 45,
  "currentStep": "Generating scenes"
}
```

**Status Values:**
- `pending` - In queue
- `processing` - Being generated
- `completed` - Ready for use
- `failed` - Generation failed

---

### List Characters/Assets

```http
GET /characters/{userId}
```

---

### Delete Song

```http
DELETE /songs/{userId}/{songId}
```

---

### Delete Video

```http
DELETE /videos/{userId}/{videoId}
```

---

## Media Upload APIs

### Upload Audio

Upload existing audio files.

```http
POST /songs/{userId}/upload
Content-Type: multipart/form-data
```

**Form Data:**
- `file` - Audio file (MP3, WAV, M4A, AAC, FLAC)
- `title` - Name for the audio

**Limits:** 50MB max

---

### Upload Video

Upload existing video files.

```http
POST /videos/{userId}/upload
Content-Type: multipart/form-data
```

**Form Data:**
- `file` - Video file (MP4, MOV, WebM, AVI)
- `title` - Name for the video

**Limits:** 200MB max

---

### Get Upload URL (Large Files)

For large files, get a pre-signed upload URL.

```http
POST /videos/{userId}/get-upload-url
```

**Request Body:**
```json
{
  "filename": "my-video.mp4",
  "contentType": "video/mp4"
}
```

**Response:**
```json
{
  "uploadUrl": "https://s3.amazonaws.com/...",
  "videoKey": "uploads/user_123/abc123.mp4"
}
```

Then upload directly to S3:
```http
PUT {uploadUrl}
Content-Type: video/mp4

[binary data]
```

---

## Social Publishing APIs

### Connect Social Platform

Get OAuth URL for connecting platforms.

**YouTube:**
```http
GET /youtube/auth-url?userId={userId}
```

**TikTok:**
```http
GET /tiktok/auth-url?userId={userId}
```

**Instagram:**
```http
GET /instagram/auth-url?userId={userId}
```

**LinkedIn:**
```http
GET /linkedin/auth-url?userId={userId}
```

**Response:**
```json
{
  "authUrl": "https://accounts.google.com/o/oauth2/..."
}
```

Redirect user to `authUrl` to complete OAuth flow.

---

### Get Connected Accounts

```http
GET /social-accounts?userId={userId}
```

**Response:**
```json
{
  "accounts": [
    {
      "accountId": "acc_123",
      "platform": "youtube",
      "displayName": "My Channel",
      "connected": true
    },
    {
      "accountId": "acc_456",
      "platform": "tiktok",
      "displayName": "@myaccount",
      "connected": true
    }
  ]
}
```

---

### Disconnect Platform

```http
DELETE /social-accounts/{accountId}?userId={userId}
```

---

### Publish Video to Platform

**TikTok:**
```http
POST /videos/{userId}/{videoId}/tiktok-upload
```

**YouTube:**
```http
POST /videos/{userId}/{videoId}/youtube-upload
```

**Instagram:**
```http
POST /videos/{userId}/{videoId}/instagram-upload
```

**LinkedIn:**
```http
POST /videos/{userId}/{videoId}/linkedin-upload
```

**Request Body:**
```json
{
  "title": "Check out my new product!",
  "description": "Amazing features you'll love",
  "hashtags": ["#product", "#review", "#tech"],
  "accountId": "acc_123"
}
```

**Token Cost:** 10 tokens per upload

---

### Batch Upload to Multiple Platforms

```http
POST /videos/{userId}/{videoId}/batch-social-upload
```

**Request Body:**
```json
{
  "platforms": ["tiktok", "youtube", "instagram"],
  "platformTargets": [
    {"platform": "tiktok", "accountId": "acc_123"},
    {"platform": "youtube", "accountId": "acc_456"},
    {"platform": "instagram", "accountId": "acc_789"}
  ],
  "title": "New product launch!",
  "description": "Check out our latest release",
  "hashtags": ["#launch", "#newproduct"]
}
```

---

### Generate Social Metadata

AI-generated titles, descriptions, and hashtags.

```http
POST /videos/{userId}/{videoId}/social-metadata
```

**Request Body:**
```json
{
  "platform": "tiktok",
  "context": "Product launch video for fitness app",
  "tone": "excited"
}
```

**Response:**
```json
{
  "title": "This fitness app changed my routine! 💪",
  "description": "I've been using FitFlow for 2 weeks and the results are amazing...",
  "hashtags": ["#fitness", "#workout", "#fitnessmotivation", "#fyp"]
}
```

---

### Generate Thumbnail

```http
POST /videos/{userId}/{videoId}/social-thumbnail
```

**Request Body:**
```json
{
  "style": "bold",
  "text": "You won't believe this!",
  "frameTime": 5
}
```

**Response:**
```json
{
  "thumbnailUrl": "https://..."
}
```

---

## Scheduling APIs

### Schedule Post

```http
POST /scheduled-posts
```

**Request Body:**
```json
{
  "userId": "user_123",
  "videoId": "vid_def456",
  "scheduledTime": "2024-01-20T15:00:00Z",
  "platforms": ["tiktok", "instagram"],
  "platformTargets": [
    {"platform": "tiktok", "accountId": "acc_123"},
    {"platform": "instagram", "accountId": "acc_456"}
  ],
  "title": "Weekend vibes!",
  "description": "Perfect way to start the weekend",
  "hashtags": ["#weekend", "#vibes"]
}
```

**Response:**
```json
{
  "success": true,
  "scheduleId": "sched_abc123",
  "scheduledTime": "2024-01-20T15:00:00Z"
}
```

---

### List Scheduled Posts

```http
GET /scheduled-posts?userId={userId}
```

**Response:**
```json
{
  "scheduledPosts": [
    {
      "scheduleId": "sched_abc123",
      "videoId": "vid_def456",
      "scheduledTime": "2024-01-20T15:00:00Z",
      "platforms": ["tiktok", "instagram"],
      "status": "scheduled"
    }
  ]
}
```

---

### Cancel Scheduled Post

```http
DELETE /scheduled-posts/{scheduleId}?userId={userId}
```

---

### Execute Scheduled Post Now

```http
POST /scheduled-posts/{scheduleId}/execute?userId={userId}
```

---

## User APIs

### Get User Balance

```http
GET /user/me
```

**Response:**
```json
{
  "userId": "user_123",
  "email": "user@example.com",
  "plan": "scale",
  "tokenBalance": 4500,
  "tokensUsedThisMonth": 1500,
  "planLimit": 10000
}
```

---

## Video Queue Status

Check system-wide video processing queue.

```http
GET /videos/queue/status
```

**Response:**
```json
{
  "processing": 3,
  "queued": 5,
  "maxConcurrent": 4
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

**Common Error Codes:**

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing API key |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `INSUFFICIENT_TOKENS` | 402 | Not enough tokens |
| `RATE_LIMITED` | 429 | Too many requests |
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `PROCESSING_ERROR` | 500 | Generation failed |

---

## Rate Limits

| Endpoint Category | Limit |
|-------------------|-------|
| Song generation | 5/minute |
| Video generation | 2/minute |
| Status checks | 60/minute |
| Uploads | 10/minute |
| Social posts | 4/hour per platform |

---

## Webhooks (Coming Soon)

Configure webhooks to receive notifications when:
- Video generation completes
- Scheduled post executes
- Token balance low

Contact support@agentgruvi.com for early access.
