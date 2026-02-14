---
name: gruvi
version: 1.3.0
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

### Finding Your API Key

**Check these locations in order:**

1. **Skill credentials file (primary):** Read `~/.claude/skills/gruvi/.credentials.json` — if `GRUVI_KEY` is non-empty, use it.
2. **Environment variable:** `$GRUVI_KEY` (check with `echo $GRUVI_KEY`)
3. **Project .env file:** Look for `GRUVI_KEY=` in the project's `.env` file

If none of these have the key, ask your human to go to https://agentgruvi.com/account and generate an Agent Key.

### Storing the API Key (IMPORTANT)

When you receive a Gruvi API key, **persist it immediately** so it survives across sessions:

1. **Write to the skill credentials file** (this is the primary, persistent store):
   ```bash
   # Extract userId from key format: gruvi_agent_<userId>_<secret>
   # Write to ~/.claude/skills/gruvi/.credentials.json:
   cat > ~/.claude/skills/gruvi/.credentials.json << 'CREDENTIALS'
   {
     "GRUVI_KEY": "gruvi_agent_<keyId>_<secret>",
     "GRUVI_USER_ID": "<keyId>"
   }
   CREDENTIALS
   ```

2. **Optionally also set in the project's `.env` file** (if one exists):
   ```bash
   GRUVI_KEY=gruvi_agent_<keyId>_<secret>
   GRUVI_USER_ID=<keyId>
   ```

**On every session start**, read `~/.claude/skills/gruvi/.credentials.json` first. If the key is there, load it and proceed — do NOT ask the user for the key again.

**Key format:** `gruvi_agent_<keyId>_<secret>`
- Example: `gruvi_agent_2c9c7a0aac28_XchjEKKM6PUe01RWwQmQaslWkl9iKwJ8`
- The `keyId` = `2c9c7a0aac28` (portion between `gruvi_agent_` and last `_`)
- Many endpoints need `{userId}` in the URL — this is the `keyId`

### First API Call

```bash
# Check your account & balance
curl -H "Authorization: Bearer $GRUVI_KEY" \
  https://api.gruvimusic.com/api/user/account
# Returns: {"user": {"userId": "...", "subscription": {"tier": "starter"}, "allowances": {"tokens": {"remaining": 4500}}, ...}}
```

**No account yet?** Ask your human to sign up at https://agentgruvi.com

**Full documentation:** https://agentgruvi.com/docs

---

## Authentication

All API requests require a Bearer token in the Authorization header:

```
Authorization: Bearer gruvi_agent_<keyId>_<secret>
```

**Extracting your userId:** Many endpoints require `{userId}` in the URL path. This is the `keyId` portion of your API key — the part between `gruvi_agent_` and the last `_`.

| Key | userId |
|-----|--------|
| `gruvi_agent_2c9c7a0aac28_XchjEKKM...` | `2c9c7a0aac28` |
| `gruvi_agent_abc123def456_SecretKey...` | `abc123def456` |

The server validates your key and maps it to the correct user account for token billing.

---

## CRITICAL: Agent Behavior Rules

**You MUST follow these rules EVERY TIME. No exceptions. Violating these rules wastes real money.**

### 1. Check for Existing Assets — NEVER Duplicate

Before creating ANY asset, **always list existing ones first** and check for matches:

```bash
# Check existing characters BEFORE creating a new one
curl -H "Authorization: Bearer $GRUVI_KEY" \
  https://api.gruvimusic.com/api/gruvi/characters/$GRUVI_USER_ID

# Check existing songs
curl -H "Authorization: Bearer $GRUVI_KEY" \
  https://api.gruvimusic.com/api/gruvi/songs/$GRUVI_USER_ID

# Check existing voiceovers
curl -H "Authorization: Bearer $GRUVI_KEY" \
  https://api.gruvimusic.com/api/gruvi/narratives/$GRUVI_USER_ID

# Check existing videos
curl -H "Authorization: Bearer $GRUVI_KEY" \
  https://api.gruvimusic.com/api/gruvi/videos/$GRUVI_USER_ID
```

**If a matching or similar asset already exists, REUSE IT.** Do not create a duplicate. Compare names, descriptions, and prompts. If in doubt, ask the user: "I found an existing [asset] called [name] — should I reuse it or create a new one?"

### 2. Check for In-Progress Jobs — NEVER Create Duplicates

Before starting ANY generation (song, voiceover, video):
1. Check existing assets (step 1 above)
2. Look for any with status `queued` or `processing`
3. **If a similar job is already running, DO NOT start another one.** Tell the user: "There's already a [type] in progress ([id]). Want me to wait for it, or create a new one?"

### 3. Confirm Before Spending Tokens

Before EVERY token-spending API call, present this to the user and **wait for explicit approval**:
- What you're about to create (with details)
- Estimated token cost
- Current balance (from account check)
- **"Should I proceed?"**

**Do NOT auto-proceed. Do NOT assume approval.** The user must explicitly say yes.

### 4. One Job at a Time

- Never start a new generation while a previous one is still `queued` or `processing`
- Never submit the same generation request twice, even if the first seems slow
- If a job is in progress, poll and wait — do not create a duplicate "just in case"

### 5. Stop Means Stop — IMMEDIATELY

When the user says "stop", "cancel", "no", or anything similar:
- **Immediately cease ALL API activity** — no more requests, no polling, no "finishing up"
- Kill any background polling loops
- Do not say "let me just finish this one thing"
- Acknowledge the stop and wait silently for new instructions

### 6. Check Balance First

Before starting any workflow, check the account balance:
```bash
curl -H "Authorization: Bearer $GRUVI_KEY" \
  https://api.gruvimusic.com/api/user/account
```
Show the user their balance and the estimated total cost before doing anything.

### 7. Confirm Video Settings Before Every Submission

Before submitting ANY video generation request, present a summary of the video settings to the user for review:

```
Video ready to submit:
- Video type: cinematic (standard) / still (storybook)
- Aspect ratio: portrait (9:16)
- Background music: no
- Style: photo-realism
- Characters: Vulpix, Alolan Vulpix
- Narration: narr_xyz
[Estimated cost: X tokens]

Submit? (yes/no)
```

Wait for explicit approval before calling the video generation endpoint. This gives the user a chance to adjust background music, aspect ratio, style, or anything else before tokens are spent.

Defaults (if user hasn't specified): **portrait**, **no background music**, **cinematic (standard)**. For story videos, always ask whether the user wants **still** (storybook — no movement, different scenes like a picture book) or **cinematic** (standard — regular video with movement). If the user states a preference, remember it for subsequent videos but still show the summary for confirmation.

### 8. Track Everything You Do

Maintain a running table in your responses:

| # | Action | Asset ID | Tokens | Status |
|---|--------|----------|--------|--------|
| 1 | Created character "Vulpix" | char_abc | 0 | Done |
| 2 | Generated voiceover | narr_xyz | 25 | Processing |

This prevents you from losing track and accidentally re-creating things.

---

## Capabilities Summary

| Feature | Description | Token Cost |
|---------|-------------|------------|
| Music | AI songs, 32 genres, 24 languages | 25-50 |
| Voiceover | 25+ voices, story/ugc modes | 25 |
| Video | Cinematic, music styles | 50/sec |
| UGC Video | Talking head, product demos | 50/sec |
| UGC Premium | Native audio, Kling O3 Pro | 100/sec |
| Character Swap | Replace people in videos (Kling AI) | 50/sec |
| App Showcase | Promo videos from screenshots | 50/sec |
| Publishing | TikTok, YouTube, Instagram, etc. | Free |
| Metadata | AI titles, descriptions, hashtags | 10 |

---

## Workflow

1. **Create assets** → Characters, products, places, apps (with images)
2. **Generate audio** → Songs or voiceovers
3. **Generate video** → Music videos, stories, UGC, character swaps
4. **Schedule posts** → TikTok, YouTube, Instagram, Facebook, LinkedIn, X

---

## Characters (Assets)

Characters are the people, products, or places in your content. **Upload at least 1 image** for best results in video generation.

**Create** (with images)
```bash
curl -X POST -H "Authorization: Bearer $GRUVI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "characterName": "Brand Hero",
    "characterType": "Human",
    "description": "Energetic young adult with casual style",
    "imageBase64Array": ["data:image/jpeg;base64,/9j/4AAQ..."]
  }' \
  https://api.gruvimusic.com/api/gruvi/characters
```

**Response:**
```json
{"success": true, "character": {"characterId": "char_abc123", "characterName": "Brand Hero", "characterType": "Human"}}
```

**Parameters:**
- `characterName` (required): Name of the character
- `characterType`: `Human`, `Product`, `Place`, `App`, `Business`, `Non-Human`
- `description`: Text description of the character
- `imageBase64Array`: Array of base64-encoded images (include the `data:image/...;base64,` prefix). Upload at least 1 image for video generation.
- `gender`: Gender description
- `age`: Age description

**Create** (without images — minimal)
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

Types: `Human`, `Product`, `Place`, `App`, `Business`, `Non-Human`

**List**: `GET /api/gruvi/characters/{userId}`

**Delete**: `DELETE /api/gruvi/characters/{userId}/{characterId}`

Cost: Free

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
```

**Response:**
```json
{"success": true, "song": {"songId": "song_abc123", "status": "processing"}, "tokensUsed": 25, "tokensRemaining": 4975}
```

**Parameters:**
- `songPrompt` (required): Description of the song
- `genre` (required): Genre name or `"auto"`
- `mood` (required): Mood name or `"auto"`
- `songLength`: `short` (~30-90s, 25 tokens) or `standard` (~1.5-3min, 50 tokens). Only for `standard` trackType.
- `trackType`: `standard` or `premium` (see below)
- `language`: `en`, `es`, `fr`, `de`, `it`, `pt`, `ja`, `ko`, `zh`, etc.
- `characterIds`: (optional) Array of character IDs to feature in the song lyrics
- `creativity`: 0-10 scale (0 = exact prompt, 10 = creative interpretation)

**Premium-only parameters:**
- `premiumDurationMs`: Duration in milliseconds, 30000-180000 (30s to 3min). Required for premium.
- `forceInstrumental`: `true` = instrumental only, no vocals (default: `true`). `false` = vocal track with model-generated lyrics.

### Standard vs Premium Tracks

| | Standard | Premium |
|--|----------|---------|
| Engine | Minimax | ElevenLabs |
| Lyrics | Claude-generated, always included | Optional (`forceInstrumental: false`) |
| Instrumental | Not available | Yes (`forceInstrumental: true`, default) |
| Length control | `songLength`: `short` or `standard` | `premiumDurationMs`: exact ms (30000-180000) |
| Cost | 25 tokens (short) / 50 tokens (standard) | 50 tokens per 30 seconds |
| Best for | Songs with lyrics | Instrumental background music, cinematic scores |

**Check status** (poll every 10s)
```bash
curl -H "Authorization: Bearer $GRUVI_KEY" \
  https://api.gruvimusic.com/api/gruvi/songs/$GRUVI_USER_ID/{songId}
```

**Response (completed):**
```json
{"songId": "song_abc123", "status": "completed", "audioUrl": "https://d3p6pc6t5m1by8.cloudfront.net/.../audio.mp3"}
```

Cost: 25-50 tokens (depends on length and quality)

---

## Voiceovers

**Generate**
```bash
curl -X POST -H "Authorization: Bearer $GRUVI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your script or prompt text here",
    "narrativeType": "story",
    "narratorId": "albus",
    "characterIds": ["char-id-1"]
  }' \
  https://api.gruvimusic.com/api/gruvi/narratives/$GRUVI_USER_ID
```

**Response:**
```json
{"narrativeId": "narr_abc123", "status": "processing", "tokensCost": 25, "tokensRemaining": 4950}
```

**Parameters:**
- `text` (required): The script or prompt text (max 10,000 characters)
- `narrativeType` (required): `"story"` or `"ugc"`
  - `story`: Narrator-style voiceover (documentaries, explainers, storytelling)
  - `ugc`: TikTok-style content (hooks, CTAs, casual tone, short-form)
- `narratorId`: Voice ID (e.g., `"albus"` — a friendly grandpa narrator, great for documentaries)
- `voiceId`: Alternative voice ID
- `title`: Title for the narrative
- `characterIds`: (optional) Array of character IDs to mention

**Available voices**: `GET /api/gruvi/narratives/voices`

**Check status** (poll every 10s)
```bash
curl -H "Authorization: Bearer $GRUVI_KEY" \
  https://api.gruvimusic.com/api/gruvi/narratives/$GRUVI_USER_ID/{narrativeId}
```

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
    "aspectRatio": "portrait",
    "videoType": "standard",
    "includeBackgroundMusic": false
  }' \
  https://api.gruvimusic.com/api/gruvi/videos/generate
```

**Response (202):**
```json
{"videoId": "vid_abc123", "status": "queued", "tokensUsed": 500, "tokensRemaining": 4500}
```

**Parameters:**
- `videoContentType` (required): `music`, `story`, `ugc-voiceover`, `ugc-premium`, `app-promo-music`, `app-promo-voiceover`
- `songId`: Required for `music` and `app-promo-music` types
- `narrativeId`: Required for `story`, `ugc-voiceover`, `app-promo-voiceover` types
- `characterIds`: Array of character IDs to appear in the video
- `videoType`: `still` or `standard` (see below)
  - `still`: Storybook-style — different scenes with no movement, like a picture book. 200 tokens flat.
  - `standard`: Cinematic — regular video with movement and animation. 50 tokens/sec.
- `style`: `3d-cartoon` (default), `photo-realism`, `anime`, `claymation`, `comic-book`, `watercolor`, `pixel`, `sketch`, `childrens-storybook`, `origami`, `wool-knit`, `sugarpop`, `classic-blocks`, `spray-paint`, `playground-crayon`, `minecraft` (not used for app-promo/ugc)
- `aspectRatio`: `portrait` (9:16, **default**) or `landscape` (16:9). Always shown in pre-submit review.
- `videoPrompt`: Description of the video concept
- `creativity`: 0-10 scale
- `resolution`: `1080p` (default) or `4K`
- `includeBackgroundMusic`: Add instrumental background (boolean, **default: false**). Always shown in pre-submit review.
- `backgroundMusicPrompt`: Style hint for background music (e.g., "upbeat pop", "cinematic orchestral")

**Check status** (poll every 30s)
```bash
curl -H "Authorization: Bearer $GRUVI_KEY" \
  https://api.gruvimusic.com/api/gruvi/videos/$GRUVI_USER_ID/{videoId}/status
```

**Response (completed):**
```json
{"videoId": "vid_abc123", "status": "completed", "videoUrl": "https://d3p6pc6t5m1by8.cloudfront.net/.../video.mp4"}
```

**Status values:** `queued`, `processing`, `completed`, `failed`

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
    "ugcDurationSeconds": 10,
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
- `ugcDurationSeconds`: Exact duration in seconds, 5-15 (default: 10). Backend maps to internal Veo duration tiers automatically.
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
    "description": "A productivity app for task management",
    "imageBase64Array": ["data:image/png;base64,...screenshot1...", "data:image/png;base64,...screenshot2..."]
  }' \
  https://api.gruvimusic.com/api/gruvi/characters
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

## Video Types Reference

All video generation uses the same endpoint (`POST /api/gruvi/videos/generate`) but differs by `videoContentType` and related parameters.

### Video Content Types at a Glance

| Content Type | Description | Audio Source | Engine | Max Length | Cost |
|-------------|-------------|-------------|--------|-----------|------|
| `music` | Music video synced to a song | `songId` (required) | Kling | Song length | 50/sec (standard), 200 flat (still) |
| `story` | Narrated story/documentary video | `narrativeId` (required) | Kling | Voiceover length | 50/sec (standard), 200 flat (still) |
| `ugc-voiceover` | Talking head with voiceover | `narrativeId` (required) | Kling | Up to 60s | 50/sec |
| `ugc-premium` | Premium short-form, native or voiceover audio | `videoPrompt` (required) | **Kling O3 Pro** | **5-15s** | **100/sec** |
| `app-promo-music` | App screenshots animated to music | `songId` (required) | Kling | Song length | 50/sec |
| `app-promo-voiceover` | App screenshots animated to voiceover | `narrativeId` (required) | Kling | Voiceover length | 50/sec |

### Video Types (Movement Style)

Applies to `music` and `story` content types:

| `videoType` | Description | Cost |
|-------------|-------------|------|
| `standard` | Cinematic — regular video with movement and animation | 50 tokens/sec |
| `still` | Storybook — different scenes, no movement, like a picture book | 200 tokens flat |

### Visual Styles

Applies to `music`, `story`, and `character-swap` content types. Not used for `ugc-*` or `app-promo-*`.

| Style | Description |
|-------|-------------|
| `3d-cartoon` | Default, Pixar-like 3D animation |
| `photo-realism` | Photorealistic rendering |
| `anime` | Japanese anime style |
| `claymation` | Stop-motion clay style |
| `comic-book` | Comic/graphic novel panels |
| `watercolor` | Painted watercolor aesthetic |
| `pixel` | Retro pixel art |
| `sketch` | Hand-drawn pencil sketch |
| `childrens-storybook` | Soft, illustrated children's book |
| `origami` | Paper-folding art style |
| `wool-knit` | Knitted/crocheted texture |
| `sugarpop` | Candy/sugar-coated bright colors |
| `classic-blocks` | LEGO/building block style |
| `spray-paint` | Graffiti/street art |
| `playground-crayon` | Crayon drawing, kid-like |
| `minecraft` | Voxel/Minecraft world |

### UGC Video Comparison

| | UGC Voiceover | UGC Premium |
|--|--------------|-------------|
| Content type | `ugc-voiceover` | `ugc-premium` |
| Engine | Kling (standard) | **Kling O3 Pro** (higher quality) |
| Audio | Separate voiceover (`narrativeId`) | Native audio **or** voiceover |
| Audio modes | N/A | `native` (built-in) or `voiceover` (narrativeId) |
| Max duration | ~60s | **5-15 seconds** |
| Duration control | Determined by voiceover length | `ugcDurationSeconds` (5-15) |
| Talking head | Auto-generated or from Human character | Auto-generated or from Human character |
| Cost per second | 50 tokens | **100 tokens** |
| Best for | Longer influencer-style content, product demos | Punchy TikTok/Reels, high-quality short-form |

### UGC Premium Audio Modes

| `ugcAudioMode` | Description | Requires |
|----------------|-------------|----------|
| `native` | Kling O3 Pro generates audio alongside video (ambient/scene sounds) | Just `videoPrompt` |
| `voiceover` | Your pre-made voiceover is merged with generated video | `narrativeId` |

### App Showcase Video Comparison

| | App Promo Music | App Promo Voiceover |
|--|----------------|---------------------|
| Content type | `app-promo-music` | `app-promo-voiceover` |
| Audio | Song (`songId`) | Voiceover (`narrativeId`) |
| Requires | App asset with screenshots + song | App asset with screenshots + voiceover |
| Style | Screenshots animated, synced to beat | Screenshots animated, synced to narration |
| Cost | 50 tokens/sec | 50 tokens/sec |

### Common Parameters (All Video Types)

| Parameter | Values | Default | Notes |
|-----------|--------|---------|-------|
| `aspectRatio` | `portrait`, `landscape` | `portrait` | 9:16 or 16:9 |
| `characterIds` | Array of IDs | — | Characters/products in the video |
| `includeBackgroundMusic` | `true`/`false` | `false` | Adds instrumental background (+50/30s) |
| `backgroundMusicPrompt` | String | — | Style hint (e.g., "upbeat pop") |
| `resolution` | `1080p`, `4K` | `1080p` | Output resolution |
| `creativity` | 0-10 | — | 0 = exact prompt, 10 = creative |
| `videoPrompt` | String | — | Description of video concept |

---

## Token Costs Summary

| Content | Cost |
|---------|------|
| Song standard (short, 30-90s) | 25 |
| Song standard (standard, 90-180s) | 50 |
| Song premium (ElevenLabs, instrumental or vocal) | 50/30s |
| Voiceover | 25 |
| Video (still/storybook) | 200 flat |
| Video (cinematic/standard) | 50/sec |
| UGC Video (voiceover) | 50/sec |
| UGC Premium (native audio) | 100/sec |
| Character Swap | 50/sec |
| Background music add-on | 50/30s |
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

## Account & Balance

**Check your account, subscription, and token balance:**
```bash
curl -H "Authorization: Bearer $GRUVI_KEY" \
  https://api.gruvimusic.com/api/user/account
```

**Response:**
```json
{
  "user": {
    "userId": "2c9c7a0aac28",
    "username": "myuser",
    "email": "user@example.com",
    "subscription": {
      "tier": "starter",
      "status": "active",
      "renewalDate": "2025-03-01T00:00:00Z"
    },
    "allowances": {
      "tokens": {
        "remaining": 4500,
        "used": 500,
        "monthly": 5000
      }
    },
    "isVerified": true,
    "createdAt": "2025-01-15T10:00:00Z"
  }
}
```

Token balance is also returned in every generation response as `tokensRemaining`.

If low or empty, tell your human:
> "We're out of Gruvi tokens. Please visit https://agentgruvi.com/pricing to buy more."

---

## Polling for Async Operations

All generation operations are async. Use this pattern:

```bash
# 1. Start generation → returns job ID + tokensRemaining
# 2. Poll status every 30 seconds using the appropriate endpoint:

# Songs:
curl -H "Authorization: Bearer $GRUVI_KEY" \
  https://api.gruvimusic.com/api/gruvi/songs/$GRUVI_USER_ID/{songId}

# Voiceovers:
curl -H "Authorization: Bearer $GRUVI_KEY" \
  https://api.gruvimusic.com/api/gruvi/narratives/$GRUVI_USER_ID/{narrativeId}

# Videos:
curl -H "Authorization: Bearer $GRUVI_KEY" \
  https://api.gruvimusic.com/api/gruvi/videos/$GRUVI_USER_ID/{videoId}/status

# 3. When status is "completed", the response includes the result URL
```

**Status values:** `queued`, `processing`, `completed`, `failed`

---

## Error Responses

| Status Code | Meaning |
|-------------|---------|
| 400 | Bad request — check required parameters and allowed values |
| 401 | Invalid API key |
| 402 | Insufficient tokens — tell user to top up |
| 403 | No active subscription |
| 404 | Resource not found |
| 500 | Server error — retry after a moment |

---

## Full Documentation

For complete API reference and workflows:
- https://agentgruvi.com/docs
- https://agentgruvi.com/docs/for-agents
- https://agentgruvi.com/docs/api-reference
