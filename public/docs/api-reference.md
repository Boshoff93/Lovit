# Gruvi API Reference

Complete API documentation for programmatic access to Gruvi.

## Base URL

```
https://api.gruvimusic.com
```

## Authentication

All requests require a Bearer token in the Authorization header:

```bash
curl -H "Authorization: Bearer gruvi_agent_xxxx" \
  https://api.gruvimusic.com/api/gruvi/user/me
```

Get your API key from [Account Settings](https://agentgruvi.com/account).

---

## User

### Get Current User

```http
GET /api/gruvi/user/me
```

**Response:**
```json
{
  "userId": "user_abc123",
  "email": "user@example.com",
  "plan": "Scale",
  "tokenBalance": 15000,
  "connectedAccounts": ["tiktok", "youtube", "instagram"]
}
```

---

## AI Assets (Characters)

Assets are reusable references for content generation - people, products, places, etc.

### Create Asset

```http
POST /api/gruvi/characters
```

**Request:**
```json
{
  "characterName": "Brand Hero",
  "characterType": "Human",
  "description": "Young professional, casual style, friendly smile"
}
```

**Character Types:** `Human`, `Non-Human`, `Product`, `Place`, `App`, `Business`

**Response:**
```json
{
  "characterId": "char_abc123",
  "characterName": "Brand Hero",
  "characterType": "Human",
  "description": "Young professional...",
  "createdAt": "2025-01-15T10:00:00Z"
}
```

### List Assets

```http
GET /api/gruvi/characters/{userId}
```

### Delete Asset

```http
DELETE /api/gruvi/characters/{userId}/{characterId}
```

### Upload Asset Images

```http
POST /api/gruvi/characters/{characterId}/images
Content-Type: multipart/form-data
```

---

## Music Generation

### Generate Song

```http
POST /api/gruvi/songs/generate
```

**Request:**
```json
{
  "songPrompt": "Upbeat pop song about summer adventures",
  "genre": "pop",
  "mood": "happy",
  "songLength": "short",
  "trackType": "standard",
  "language": "en",
  "characterIds": ["char_abc123"]
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| songPrompt | string | Yes | Description of the song |
| genre | string | No | Genre (pop, rock, hip-hop, etc.) |
| mood | string | No | Mood (happy, sad, energetic, etc.) |
| songLength | string | No | `short` (30-90s) or `standard` (90-180s) |
| trackType | string | No | `standard` or `premium` |
| language | string | No | Language code (en, es, fr, etc.) |
| characterIds | array | No | Characters to reference in lyrics |
| trackDuration | number | No | Exact duration (premium only, 30-180s) |
| instrumental | boolean | No | No lyrics (premium only) |

**Response (202 Accepted):**
```json
{
  "songId": "song_xyz789",
  "status": "processing",
  "estimatedTime": 60
}
```

### Get Song Status

```http
GET /api/gruvi/songs/{userId}/{songId}
```

**Response (completed):**
```json
{
  "songId": "song_xyz789",
  "status": "completed",
  "audioUrl": "https://cdn.gruvimusic.com/songs/xyz789.mp3",
  "duration": 45,
  "title": "Summer Adventures",
  "lyrics": "..."
}
```

**Status values:** `processing`, `completed`, `failed`

---

## Voiceover Generation

### Generate Voiceover

```http
POST /api/gruvi/narratives/{userId}
```

**Request:**
```json
{
  "text": "Your script or prompt here",
  "narrativeType": "ugc",
  "narratorId": "albus",
  "characterIds": ["char_abc123"]
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| text | string | Yes | Script or prompt |
| narrativeType | string | No | `story` or `ugc`. Omit for direct TTS. |
| narratorId | string | Yes | Voice ID |
| characterIds | array | No | Characters to mention |
| voiceChange | boolean | No | Apply voice transformation |

**Narrative Types:**
- (omitted) - Exact text-to-speech (default)
- `story` - AI expands into cinematic narrative
- `ugc` - Hook-driven UGC content format

**Response (202 Accepted):**
```json
{
  "narrativeId": "narr_abc123",
  "status": "processing"
}
```

### Get Available Voices

```http
GET /api/gruvi/narratives/voices
```

**Response:**
```json
{
  "voices": [
    {
      "id": "albus",
      "name": "Albus",
      "personality": "Wise, calm, authoritative",
      "gender": "male",
      "languages": ["en", "es"]
    },
    ...
  ]
}
```

---

## Video Generation

### Generate Video

```http
POST /api/gruvi/videos/generate
```

**Request (Music Video):**
```json
{
  "videoContentType": "music",
  "songId": "song_xyz789",
  "characterIds": ["char_abc123"],
  "style": "3d-cartoon",
  "aspectRatio": "portrait"
}
```

**Request (UGC Video):**
```json
{
  "videoContentType": "ugc-voiceover",
  "narrativeId": "narr_abc123",
  "characterIds": ["char_abc123"],
  "aspectRatio": "portrait"
}
```

**Request (UGC Premium — Native Audio):**
```json
{
  "videoContentType": "ugc-premium",
  "videoPrompt": "Young woman showing a new product to camera, bright natural lighting",
  "ugcDurationSeconds": 10,
  "ugcAudioMode": "native",
  "characterIds": ["char_abc123"],
  "aspectRatio": "portrait",
  "includeBackgroundMusic": false
}
```

**Request (UGC Premium — With Voiceover):**
```json
{
  "videoContentType": "ugc-premium",
  "videoPrompt": "Young woman showing a new product to camera, bright natural lighting",
  "ugcDurationSeconds": 10,
  "ugcAudioMode": "voiceover",
  "narrativeId": "narr_abc123",
  "characterIds": ["char_abc123"],
  "aspectRatio": "portrait",
  "includeBackgroundMusic": true,
  "backgroundMusicPrompt": "upbeat pop"
}
```

**Request (App Showcase):**
```json
{
  "videoContentType": "app-promo-voiceover",
  "narrativeId": "narr_abc123",
  "characterIds": ["app_asset_id"],
  "aspectRatio": "portrait"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| videoContentType | string | Yes | Video type (see below) |
| songId | string | Conditional | Required for music types |
| narrativeId | string | Conditional | Required for voiceover types, and ugc-premium with voiceover audio mode |
| videoPrompt | string | Conditional | Required for ugc-premium |
| ugcDurationSeconds | number | No | UGC Premium only: exact duration in seconds, 5-15 (default: 10) |
| ugcAudioMode | string | No | UGC Premium only: `native` or `voiceover` (default: native) |
| includeBackgroundMusic | boolean | No | UGC Premium only: add AI background music (default: false) |
| backgroundMusicPrompt | string | No | UGC Premium only: music style hint |
| characterIds | array | No | Characters to appear |
| style | string | No | Visual style: `3d-cartoon`, `photo-realism`, `anime`, `claymation`, `comic-book`, `watercolor`, `pixel`, `sketch`, `childrens-storybook`, `origami`, `wool-knit`, `sugarpop`, `classic-blocks`, `spray-paint`, `playground-crayon`, `minecraft` |
| aspectRatio | string | No | `portrait`, `landscape` |

**Video Content Types:**
- `music` - Music video
- `story` - Cinematic story
- `ugc-voiceover` - UGC with voiceover
- `ugc-premium` - UGC Premium with native audio (Kling O3 Pro)
- `app-promo-music` - App showcase with music
- `app-promo-voiceover` - App showcase with voiceover

**Styles:** `Cinematic`, `3D Cartoon`, `Anime`, `Photo-Realism`

**Response (202 Accepted):**
```json
{
  "videoId": "vid_abc123",
  "status": "queued",
  "queuePosition": 2
}
```

### Get Video Status

```http
GET /api/gruvi/videos/{userId}/{videoId}/status
```

**Response:**
```json
{
  "videoId": "vid_abc123",
  "status": "completed",
  "videoUrl": "https://cdn.gruvimusic.com/videos/abc123.mp4",
  "thumbnailUrl": "https://cdn.gruvimusic.com/thumbs/abc123.jpg",
  "duration": 30
}
```

---

## Character Swap

### Create Character Swap

```http
POST /api/gruvi/character-swap
```

**Request:**
```json
{
  "sourceVideoId": "vid_source123",
  "targetCharacterId": "char_abc123",
  "swapMode": "replace-character",
  "referenceMode": "follow-video",
  "style": "realistic"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sourceVideoId | string | Yes | Video to process |
| targetCharacterId | string | Yes | Character to swap in |
| swapMode | string | Yes | See modes below |
| referenceMode | string | No | `follow-video` or `follow-reference` |
| style | string | No | Output style |
| customPrompt | string | No | For custom-prompt mode |
| environmentPrompt | string | No | For replace-with-env mode |

**Swap Modes:**
- `replace-character` - Replace person only
- `replace-with-environment` - Replace person and background
- `custom-prompt` - Full control via prompt

**Response (202 Accepted):**
```json
{
  "swapId": "swap_abc123",
  "status": "processing"
}
```

---

## Social Publishing

### Schedule Post

```http
POST /api/gruvi/scheduled-posts
```

**Request:**
```json
{
  "videoId": "vid_abc123",
  "platforms": [
    {"platform": "tiktok", "accountId": "acc_123"},
    {"platform": "instagram", "accountId": "acc_456"}
  ],
  "scheduledTime": "2025-02-15T15:00:00Z",
  "title": "Check this out!",
  "description": "Amazing new product...",
  "hashtags": ["viral", "trending", "product"]
}
```

**Platforms:** `youtube`, `tiktok`, `instagram`, `facebook`, `linkedin`, `twitter`

**Response:**
```json
{
  "scheduleId": "sched_abc123",
  "scheduledTime": "2025-02-15T15:00:00Z",
  "platforms": ["tiktok", "instagram"]
}
```

### List Scheduled Posts

```http
GET /api/gruvi/scheduled-posts
```

### Cancel Scheduled Post

```http
DELETE /api/gruvi/scheduled-posts/{scheduleId}
```

### Publish Immediately

```http
POST /api/gruvi/publish
```

**Request:**
```json
{
  "videoId": "vid_abc123",
  "platforms": [{"platform": "tiktok"}],
  "title": "Check this out!",
  "description": "...",
  "hashtags": ["trending"]
}
```

---

## Metadata Generation

### Generate Metadata

```http
POST /api/gruvi/metadata/generate
```

**Request:**
```json
{
  "videoId": "vid_abc123",
  "platforms": ["tiktok", "youtube"],
  "context": "Product promotion for fitness app"
}
```

**Response:**
```json
{
  "tiktok": {
    "title": "This app changed my workout routine",
    "description": "...",
    "hashtags": ["fitness", "workout", "app"]
  },
  "youtube": {
    "title": "How This Fitness App Transformed My Routine",
    "description": "...",
    "tags": ["fitness app review", "workout routine"]
  }
}
```

### Generate Thumbnail

```http
POST /api/gruvi/thumbnails/generate
```

**Request:**
```json
{
  "videoId": "vid_abc123",
  "style": "youtube",
  "text": "WATCH THIS"
}
```

---

## Media Upload

### Upload Video

```http
POST /api/gruvi/uploads/video
Content-Type: multipart/form-data
```

### Upload Audio

```http
POST /api/gruvi/uploads/audio
Content-Type: multipart/form-data
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "insufficient_tokens",
  "message": "Not enough tokens for this operation. Required: 1500, Available: 500",
  "required": 1500,
  "available": 500
}
```

**Common Error Codes:**

| Code | Description |
|------|-------------|
| `unauthorized` | Invalid or missing API key |
| `insufficient_tokens` | Not enough tokens |
| `rate_limited` | Too many requests |
| `not_found` | Resource doesn't exist |
| `validation_error` | Invalid request parameters |
| `generation_failed` | AI generation failed |

---

## Rate Limits

| Plan | Requests/minute | Concurrent jobs |
|------|-----------------|-----------------|
| Starter | 60 | 2 |
| Scale | 120 | 4 |
| Content Engine | 300 | 8 |

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 115
X-RateLimit-Reset: 1707500000
```

---

## Webhooks (Coming Soon)

Configure webhooks to receive notifications when:
- Generation completes
- Scheduled post publishes
- Token balance low

---

## SDKs

Official SDKs coming soon for:
- JavaScript/TypeScript
- Python
- Go

For now, use direct HTTP requests or your agent's HTTP tools.
