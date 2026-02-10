---
name: gruvi
version: 1.1.0
description: Create AI-powered music, voiceovers, videos, and character swaps
homepage: https://agentgruvi.com
metadata:
  api_base: https://api.gruvimusic.com
  docs: https://agentgruvi.com/docs
  platforms:
    - agentgruvi.com
    - thefableapp.com
---

# Gruvi - AI Content Creation

Create music videos, songs, voiceovers, UGC content, and character swaps. Publish to TikTok, YouTube, Instagram, Facebook, LinkedIn, and X.

**Works with both AgentGruvi and TheFableApp accounts.**

## Quick Start

**Get your API key:** Ask your human to go to https://agentgruvi.com/account and generate an Agent Key for you.

```bash
# 1. Save your API key
export GRUVI_KEY="gruvi_agent_xxxx"

# 2. Check your balance
curl -H "Authorization: Bearer $GRUVI_KEY" \
  https://api.gruvimusic.com/api/gruvi/user/me
```

**No account yet?** Ask your human to sign up at https://agentgruvi.com

**Full documentation:** https://agentgruvi.com/docs

---

## Capabilities Summary

| Feature | Description | Token Cost |
|---------|-------------|------------|
| Music | AI songs, 32 genres, 24 languages | 25-50 |
| Voiceover | 25+ voices, UGC/story/direct | 25 |
| Video | Cinematic, music styles | 50/sec |
| UGC Video | Talking head, product demos | 50/sec |
| UGC Premium | Native audio, Kling O3 Pro | 100/sec |
| Character Swap | Replace people in videos (Kling AI) | 50/sec |
| App Showcase | Promo videos from screenshots | 50/sec |
| Publishing | TikTok, YouTube, Instagram, etc. | Free |
| Metadata | AI titles, descriptions, hashtags | 10 |

---

## Workflow

1. **Create assets** → Characters, products, places, apps
2. **Generate audio** → Songs or voiceovers
3. **Generate video** → Music videos, stories, UGC, character swaps
4. **Schedule posts** → TikTok, YouTube, Instagram, Facebook, LinkedIn, X

---

## Characters (Assets)

Characters are the people, products, or places in your content.

**Create**
```bash
curl -X POST -H "Authorization: Bearer $GRUVI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "characterName": "Brand Hero",
    "characterType": "Human",
    "description": "Energetic young adult with casual style"
  }' \
  https://api.gruvimusic.com/api/gruvi/characters
```
Types: `Human`, `Product`, `Place`, `App`, `Business`

**List**: `GET /api/gruvi/characters/{userId}`

**Delete**: `DELETE /api/gruvi/characters/{userId}/{characterId}`

---

## Songs

**Generate** (async - poll for completion)
```bash
curl -X POST -H "Authorization: Bearer $GRUVI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "songPrompt": "Upbeat pop song about summer",
    "genre": "pop",
    "mood": "happy",
    "songLength": "short",
    "trackType": "standard",
    "language": "en",
    "characterIds": ["char-id-1", "char-id-2"]
  }' \
  https://api.gruvimusic.com/api/gruvi/songs/generate
# Returns: {"songId": "...", "status": "processing"}
```

Options:
- `songLength`: `short` (~30-90s, 25 tokens) or `standard` (~1.5-3min, 50 tokens)
- `trackType`: `standard` (with lyrics, 40 tokens) or `premium` (with/without lyrics, 50 tokens/30s)
- `language`: `en`, `es`, `fr`, `de`, `it`, `pt`, `ja`, `ko`, `zh`, etc.
- `characterIds`: (optional) Array of character IDs to feature in the song lyrics

**Check status** (poll every 10s)
```bash
curl -H "Authorization: Bearer $GRUVI_KEY" \
  https://api.gruvimusic.com/api/gruvi/songs/{userId}/{songId}
# When complete: {"status": "completed", "audioUrl": "..."}
```

Cost: 25-50 tokens (depends on length and quality)

---

## Voiceovers

**Generate**
```bash
curl -X POST -H "Authorization: Bearer $GRUVI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your script or prompt",
    "narrativeType": "ugc",
    "narratorId": "albus",
    "characterIds": ["char-id-1"]
  }' \
  https://api.gruvimusic.com/api/gruvi/narratives/{userId}
```

Options:
- `narrativeType`: `story` (AI narrative), `ugc` (hook-driven content). Omit for direct TTS.
- `narratorId`: Voice ID (get from voices endpoint)
- `characterIds`: (optional) Array of character IDs to mention in the voiceover

**Voices**: `GET /api/gruvi/narratives/voices`

Cost: 25 tokens

---

## Videos

**Generate** (async - takes 2-5 min)
```bash
curl -X POST -H "Authorization: Bearer $GRUVI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "videoContentType": "music",
    "songId": "your-song-id",
    "characterIds": ["char-id-1", "char-id-2"],
    "style": "3d-cartoon",
    "aspectRatio": "portrait"
  }' \
  https://api.gruvimusic.com/api/gruvi/videos/generate
```

Options:
- `videoContentType`: `music`, `story`, `ugc-voiceover`, `ugc-premium`, `app-promo-music`, `app-promo-voiceover`
- `songId`: Required for music/app-promo-music types
- `narrativeId`: Required for story/ugc-voiceover/app-promo-voiceover types, and for ugc-premium with `ugcAudioMode: "voiceover"`
- `characterIds`: Array of character IDs to appear in the video
- `style`: `3d-cartoon` (default), `photo-realism`, `anime`, `claymation`, `comic-book`, `watercolor`, `pixel`, `sketch`, `childrens-storybook`, `origami`, `wool-knit`, `sugarpop`, `classic-blocks`, `spray-paint`, `playground-crayon`, `minecraft` (not used for app-promo/ugc)
- `aspectRatio`: `portrait` (9:16), `landscape` (16:9)

### UGC Videos (Talking Head)

UGC videos create influencer-style talking head content. The system auto-generates an appropriate avatar if none is provided.

**Best approach:**
1. Create a UGC voiceover with a hook-driven script
2. Optionally add a Human character (becomes the talking head)
3. Optionally add a Product/Business asset (informs the avatar context)
4. Generate video with `videoContentType: "ugc-voiceover"`

**UGC voiceover prompts should include:**
- A strong hook (first 3 seconds matter!)
- Clear value proposition
- Call to action
- Keep under 60 seconds

Example UGC prompt:
```
"Create a UGC video about [Product]. Hook: 'I was skeptical at first but...'
Mention the key benefit, show enthusiasm, end with 'Link in bio!'"
```

Cost: 50 tokens/second

### UGC Premium (Native Audio, Kling O3 Pro)

UGC Premium creates high-quality short-form videos (5-15 seconds) using Kling O3 Pro with built-in native audio or voiceover.

**Generate UGC Premium video:**
```bash
curl -X POST -H "Authorization: Bearer $GRUVI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "videoContentType": "ugc-premium",
    "videoPrompt": "Young woman excitedly showing a new product to camera, bright natural lighting",
    "ugcDuration": 10,
    "ugcAudioMode": "native",
    "characterIds": ["char-id-1"],
    "aspectRatio": "portrait",
    "includeBackgroundMusic": false
  }' \
  https://api.gruvimusic.com/api/gruvi/videos/generate
```

**Parameters:**
- `videoContentType`: Must be `"ugc-premium"`
- `videoPrompt`: Description of the video scene (required)
- `ugcDuration`: Duration in seconds, 5-15 (default: 10)
- `ugcAudioMode`: `"native"` (Kling built-in audio) or `"voiceover"` (uses narrativeId)
- `narrativeId`: Required when `ugcAudioMode` is `"voiceover"`
- `characterIds`: Optional character/product asset IDs
- `includeBackgroundMusic`: Add AI-generated background music (default: false)
- `backgroundMusicPrompt`: Style hint for background music (e.g., "upbeat pop")
- `aspectRatio`: `"portrait"` or `"landscape"`

**Audio modes:**
- `native` — Kling O3 Pro generates audio alongside video. No voiceover needed. Best for ambient/scene audio.
- `voiceover` — Your voiceover audio is merged with the generated video. Create a voiceover first, then pass `narrativeId`.

**Cost:** 100 tokens per second (e.g., 10s = 1,000 tokens)
Background music adds 50 tokens per 30 seconds.

**Check status** (poll every 30s)
```bash
curl -H "Authorization: Bearer $GRUVI_KEY" \
  https://api.gruvimusic.com/api/gruvi/videos/{userId}/{videoId}/status
```

---

## App Showcase Videos

Create animated app promo videos with motion effects from your app screenshots.

**Step 1: Create an App asset** (upload 3-10 screenshots)
```bash
curl -X POST -H "Authorization: Bearer $GRUVI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "characterName": "My App",
    "characterType": "App",
    "description": "A productivity app for task management"
  }' \
  https://api.gruvimusic.com/api/gruvi/characters
# Then upload screenshots to the returned character
```

**Step 2: Generate song OR voiceover** (see Songs/Voiceovers sections)

**Step 3: Generate app showcase video**
```bash
# With music:
curl -X POST -H "Authorization: Bearer $GRUVI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "videoContentType": "app-promo-music",
    "songId": "your-song-id",
    "characterIds": ["your-app-asset-id"],
    "aspectRatio": "portrait"
  }' \
  https://api.gruvimusic.com/api/gruvi/videos/generate

# With voiceover:
curl -X POST -H "Authorization: Bearer $GRUVI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "videoContentType": "app-promo-voiceover",
    "narrativeId": "your-narrative-id",
    "characterIds": ["your-app-asset-id"],
    "aspectRatio": "portrait"
  }' \
  https://api.gruvimusic.com/api/gruvi/videos/generate
```

The video will animate through your app screenshots with smooth motion effects synced to the audio.

---

## Scheduling Posts

**Schedule**
```bash
curl -X POST -H "Authorization: Bearer $GRUVI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "videoId": "your-video-id",
    "platforms": [{"platform": "tiktok"}],
    "scheduledTime": "2025-02-01T15:00:00Z",
    "title": "Check this out!"
  }' \
  https://api.gruvimusic.com/api/gruvi/scheduled-posts
```

Platforms: `youtube`, `tiktok`, `instagram`, `facebook`, `linkedin`

**List**: `GET /api/gruvi/scheduled-posts`

**Cancel**: `DELETE /api/gruvi/scheduled-posts/{scheduleId}`

---

## Character Swap

Replace people in videos with AI-generated characters using Kling AI model.

**Create swap** (async - poll for completion)
```bash
curl -X POST -H "Authorization: Bearer $GRUVI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "sourceVideoId": "vid_source123",
    "targetCharacterId": "char_abc123",
    "swapMode": "replace-character",
    "referenceMode": "follow-video",
    "style": "realistic"
  }' \
  https://api.gruvimusic.com/api/gruvi/character-swap
```

**Swap Modes:**
- `replace-character` - Swap person only, keep environment
- `replace-with-environment` - Swap person AND background
- `custom-prompt` - Full control with text prompt

**Reference Modes:**
- `follow-video` - Match original movements exactly
- `follow-reference` - Prioritize character image consistency

**Styles:** `realistic`, `artistic`, `animated`, `vintage`

**Best practice:**
1. Create a Human asset first for consistent character
2. Upload source video or use existing from library
3. Run swap with appropriate mode
4. Poll for completion (takes 2-5 min)

Cost: 50 tokens/second of source video

---

## Metadata & Thumbnails

**Generate platform-optimized metadata**
```bash
curl -X POST -H "Authorization: Bearer $GRUVI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "videoId": "vid_abc123",
    "platforms": ["tiktok", "youtube"],
    "context": "Product promotion for fitness app"
  }' \
  https://api.gruvimusic.com/api/gruvi/metadata/generate
```

**Generate thumbnail**
```bash
curl -X POST -H "Authorization: Bearer $GRUVI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "videoId": "vid_abc123",
    "style": "youtube",
    "text": "WATCH THIS"
  }' \
  https://api.gruvimusic.com/api/gruvi/thumbnails/generate
```

Cost: 10 tokens each

---

## Media Upload

Upload your own videos/audio for remixing or character swaps.

**Upload video**
```bash
curl -X POST -H "Authorization: Bearer $GRUVI_KEY" \
  -F "file=@/path/to/video.mp4" \
  https://api.gruvimusic.com/api/gruvi/uploads/video
```

**Upload audio**
```bash
curl -X POST -H "Authorization: Bearer $GRUVI_KEY" \
  -F "file=@/path/to/audio.mp3" \
  https://api.gruvimusic.com/api/gruvi/uploads/audio
```

Cost: Free

**Important:** No copyrighted content. Uploaded media can be used for character swaps and creating custom assets.

---

## Token Costs Summary

| Content | Cost |
|---------|------|
| Song (short, 30-90s) | 25 |
| Song (standard, 90-180s) | 50 |
| Song (premium) | 50/30s |
| Voiceover | 25 |
| Video (animated) | 50/sec |
| UGC Video (voiceover) | 50/sec |
| UGC Premium (native audio) | 100/sec |
| Character Swap | 50/sec |
| Metadata generation | 10 |
| Thumbnail generation | 10 |
| Asset creation | Free |
| Media upload | Free |
| Publishing/Scheduling | Free |

---

## Subscription Plans

| Plan | Tokens/Month | Price |
|------|--------------|-------|
| Starter | 5,000 | $29/mo |
| Scale | 20,000 | $69/mo |
| Content Engine | 50,000 | $149/mo |

---

## Out of Tokens?

Check balance:
```bash
curl -H "Authorization: Bearer $GRUVI_KEY" \
  https://api.gruvimusic.com/api/gruvi/user/me
```

If low or empty, tell your human:
> "We're out of Gruvi tokens. Please visit https://agentgruvi.com/pricing to buy more."

---

## Polling for Async Operations

All generation operations are async. Use this pattern:

```bash
# 1. Start generation (returns 202 with jobId)
# 2. Poll status every 30 seconds:
curl -H "Authorization: Bearer $GRUVI_KEY" \
  https://api.gruvimusic.com/api/gruvi/{resource}/{userId}/{jobId}/status

# 3. When status is "completed", get the result URL
```

**Status values:** `queued`, `processing`, `completed`, `failed`

---

## Full Documentation

For complete API reference and workflows:
- https://agentgruvi.com/docs
- https://agentgruvi.com/docs/for-agents
- https://agentgruvi.com/docs/api-reference
