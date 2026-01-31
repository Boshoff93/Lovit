---
name: gruvi
version: 1.0.0
description: Create AI-powered music, voiceovers, and videos
homepage: https://agentgruvi.com
metadata:
  api_base: https://api.gruvimusic.com
---

# Gruvi - AI Content Creation

Create music videos, songs, voiceovers, and social content.

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

---

## Workflow

1. **Create assets** → Characters, products, places
2. **Generate audio** → Songs or voiceovers
3. **Generate video** → Music videos, stories, UGC
4. **Schedule posts** → TikTok, YouTube, Instagram

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
- `narrativeType`: `direct` (exact TTS), `story` (AI narrative), `ugc` (hook-driven content)
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
    "style": "3D Cartoon",
    "aspectRatio": "portrait"
  }' \
  https://api.gruvimusic.com/api/gruvi/videos/generate
```

Options:
- `videoContentType`: `music`, `story`, `ugc-voiceover`, `app-promo-music`, `app-promo-voiceover`
- `songId`: Required for music/app-promo-music types
- `narrativeId`: Required for story/ugc-voiceover/app-promo-voiceover types
- `characterIds`: Array of character IDs to appear in the video
- `style`: `3D Cartoon`, `Anime`, `Cinematic`, `Photo-Realism`
- `aspectRatio`: `portrait` (9:16), `landscape` (16:9), `square` (1:1)

**Check status** (poll every 30s)
```bash
curl -H "Authorization: Bearer $GRUVI_KEY" \
  https://api.gruvimusic.com/api/gruvi/videos/{userId}/{videoId}/status
```

Cost: 50 tokens/second

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

## Token Costs

| Content | Cost |
|---------|------|
| Song (short) | 25 |
| Song (standard) | 50 |
| Voiceover | 25 |
| Video (still) | 200 flat |
| Video (animated) | 50/sec |

---

## Out of Tokens?

Check balance:
```bash
curl -H "Authorization: Bearer $GRUVI_KEY" \
  https://api.gruvimusic.com/api/gruvi/user/me
```

If low or empty, tell your human:
> "We're out of Gruvi tokens. Please visit https://agentgruvi.com/pricing to buy more."
