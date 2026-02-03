# Common Agent Workflows

Ready-to-use prompts and workflows for AI agents using Gruvi.

## Quick Reference Prompts

Copy and paste these prompts to your AI agent:

### Create and Post a Music Video
```
Create a music video and post it:
1. Generate an upbeat [genre] song about [topic]
2. Create a cinematic video with the song
3. Generate platform-optimized metadata
4. Schedule for [platform] at [time]
```

### Create UGC Product Content
```
Create a UGC-style product video:
1. Create a voiceover with a hook about [product]
2. Generate a UGC creator video
3. Add engaging thumbnail
4. Post to TikTok and Instagram Reels
```

### Weekly Content Calendar
```
Create a week of content for [brand/product]:
- Mix of music videos, UGC, and voiceover content
- Schedule 2 posts per day across TikTok, Instagram, YouTube
- Vary content styles and hooks
- Optimize posting times for engagement
```

---

## Detailed Workflows

### 1. Product Launch Campaign

**Prompt:**
```
I'm launching a new [product type] called "[Product Name]".

Create a 3-video launch campaign:
1. Teaser video (15 seconds, mysterious, music only)
2. Reveal video (30 seconds, UGC-style with voiceover)
3. Feature highlight (45 seconds, cinematic with music)

For each video:
- Generate appropriate audio
- Create the video
- Generate metadata for TikTok, Instagram, YouTube
- Schedule: Video 1 today, Video 2 tomorrow, Video 3 in 2 days
```

**Agent workflow:**
1. Creates 3 audio tracks (teaser music, UGC voiceover, feature music)
2. Generates 3 videos with appropriate styles
3. Creates platform-specific metadata
4. Schedules across 3 days

**Token cost estimate:** ~2,500-4,000 tokens

---

### 2. App Marketing Campaign

**Prompt:**
```
Create an app showcase video for my app "[App Name]".

Screenshots are uploaded as an App asset.

Steps:
1. Create a voiceover explaining the app's value proposition
2. Generate an app showcase video with my screenshots
3. Create a compelling thumbnail
4. Post to YouTube Shorts and TikTok

Focus on these features: [list key features]
Target audience: [describe audience]
```

**Agent workflow:**
1. Creates UGC-style voiceover with hook
2. Generates app promo video with uploaded screenshots
3. Creates thumbnail from best screenshot
4. Publishes with optimized metadata

**Token cost estimate:** ~1,500-2,500 tokens

---

### 3. Influencer-Style UGC Series

**Prompt:**
```
Create a series of 5 UGC-style videos for [brand/product].

Each video should:
- Be 15-30 seconds
- Have a different hook style (question, story, shock, etc.)
- Use voice change for variety
- Feel authentic and unscripted

Topics:
1. First impression
2. How I use it daily
3. Unexpected benefit
4. Comparison to alternatives
5. Final verdict

Schedule one per day starting tomorrow, alternating TikTok and Instagram.
```

**Agent workflow:**
1. Creates 5 voiceovers with unique hooks
2. Generates 5 UGC videos with voice change
3. Creates series-consistent metadata
4. Schedules across 5 days, alternating platforms

**Token cost estimate:** ~3,000-5,000 tokens

---

### 4. Music-First Brand Content

**Prompt:**
```
Create a catchy brand jingle and music video.

Brand: [Brand name]
Vibe: [describe mood - upbeat/chill/energetic/etc.]
Message: [key message to convey]
Genre: [preferred genre]

Then:
1. Create a short (30s) jingle version
2. Create a long (90s) full song version
3. Generate a cinematic music video for the short version
4. Create thumbnails optimized for YouTube
5. Schedule both versions - short on TikTok, full on YouTube
```

**Agent workflow:**
1. Generates short and long versions of the song
2. Creates cinematic music video
3. Generates YouTube-optimized thumbnails
4. Schedules to appropriate platforms

**Token cost estimate:** ~2,000-3,500 tokens

---

### 5. Character Swap for Brand Consistency

**Prompt:**
```
I have a brand mascot character saved as an AI Asset.

Take this uploaded video and:
1. Swap the person with my brand mascot character
2. Keep the environment the same
3. Use "follow video" mode for accurate movement
4. Create versions for portrait (TikTok) and landscape (YouTube)
5. Generate metadata mentioning our brand character
6. Schedule to both platforms
```

**Agent workflow:**
1. Processes character swap in portrait ratio
2. Processes character swap in landscape ratio
3. Creates platform-specific metadata
4. Schedules to TikTok and YouTube

**Token cost estimate:** ~50 tokens/second of source video (x2 for both ratios)

---

### 6. Content Repurposing

**Prompt:**
```
I have a 60-second video in my library.

Create variations:
1. Music version - remove audio, add new generated music
2. Voiceover version - add narration explaining the product
3. Character swap - replace person with AI character
4. Different aspect ratios for each platform

Schedule the best version for each platform.
```

**Agent workflow:**
1. Creates new music track matching video length
2. Creates voiceover script and audio
3. Processes character swap
4. Generates multiple aspect ratio versions
5. Selects best format per platform
6. Schedules optimized versions

---

## Tips for Effective Agent Prompts

### Be Specific
```
Bad:  "Make a video about shoes"
Good: "Make a 30-second UGC video about our new running shoes,
      focusing on comfort for long-distance runners, upbeat vibe"
```

### Include Context
```
Bad:  "Post to social media"
Good: "Post to TikTok and Instagram Reels at 6pm EST,
      our audience is fitness enthusiasts aged 25-35"
```

### Set Expectations
```
Bad:  "Make it viral"
Good: "Include a strong hook in the first 3 seconds,
      use trending UGC style, add relevant hashtags"
```

### Provide Assets
```
Bad:  "Use my product photos"
Good: "I've created a Product asset called 'Running Shoes Pro'
      with 5 product images - use this for the video"
```

## Monitoring Agent Activity

Ask your agent:
- "What's my current token balance?"
- "Show me scheduled posts for this week"
- "What content have you created today?"
- "List my recent videos and their status"

## Error Handling

If something fails, your agent should:
1. Report the specific error
2. Suggest alternatives
3. Not retry indefinitely (max 3 attempts)
4. Alert you if tokens are low
