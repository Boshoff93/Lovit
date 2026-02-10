# UGC Creator

Generate influencer-style product videos with AI avatars.

## Overview

UGC (User Generated Content) Creator produces authentic-looking product demo videos - the kind that perform best on TikTok, Instagram Reels, and YouTube Shorts.

## Token Cost

**UGC (Voiceover):** 50 tokens per second
- 15-second video = 750 tokens
- 30-second video = 1,500 tokens

**UGC Premium (Native Audio):** 100 tokens per second
- 5-second video = 500 tokens
- 10-second video = 1,000 tokens
- 15-second video = 1,500 tokens
- Background music adds 50 tokens per 30 seconds

## Why UGC Style?

UGC-style content outperforms traditional ads because:
- Feels authentic and relatable
- Looks like organic content
- Higher engagement rates
- Better conversion rates
- Lower cost than hiring influencers

## Creation Methods

### Method 1: Prompt-Based (Recommended)

Write a description of what you want:

```
A young woman excitedly unboxing a new skincare product,
showing the texture, applying it, and reacting positively.
Clean, well-lit bathroom setting.
```

**Why this works best:**
- Most creative freedom
- AI optimizes for engagement
- Natural variations each time

### Method 2: Use Existing Voiceover

1. Create a voiceover first (see [Voiceover Guide](./voiceover.md))
2. Select it in UGC Creator
3. AI generates matching visuals

### Method 3: Combine Prompt + Voice Change

The most powerful option:
1. Write your prompt
2. Enable "Voice Change"
3. Select target voice personality
4. Get UGC video with perfect voice match

## Best Practices

### Product Integration

For best results:
1. Create a Product asset first (see [AI Assets](./ai-assets.md))
2. Reference it in your UGC prompt
3. AI will feature the product naturally

### Script Structure (15-30s)

```
HOOK (0-3s): Grab attention
"Okay I have to show you guys something..."

PROBLEM (3-8s): Relate to viewer
"You know how [common pain point]?"

SOLUTION (8-20s): Show product
"This [product] actually [benefit]..."

PROOF (20-25s): Demonstrate
[Show product in action]

CTA (25-30s): Call to action
"Link in bio if you want to try it"
```

### Voice Change Options

Voice change transforms the AI-generated voice to match specific personalities:

| Voice Type | Best For |
|------------|----------|
| Young Female | Beauty, Fashion, Lifestyle |
| Young Male | Tech, Gaming, Fitness |
| Professional | B2B, Finance, Education |
| Enthusiastic | Products, Launches, Reviews |

## Examples by Niche

### Beauty/Skincare
```
A woman in her 20s doing her morning skincare routine,
applying the product gently, showing before/after of her skin glowing.
Natural lighting, cozy bathroom setting.
```

### Tech/Gadgets
```
Someone unboxing a new wireless earbuds case,
testing the sound quality, showing the fit,
expressing surprise at the bass quality.
Modern desk setup background.
```

### Food/Beverage
```
Person making a morning coffee with the product,
showing the process, taking the first sip,
genuine reaction of satisfaction.
Bright kitchen setting.
```

### Fitness
```
Athlete demonstrating a new protein powder,
mixing it, showing the smooth texture,
tasting it post-workout, thumbs up.
Gym or home workout space.
```

## UGC Premium (Native Audio)

UGC Premium uses Kling O3 Pro to generate high-quality short-form videos (5-15 seconds) with built-in native audio.

### Why UGC Premium?

- **Native audio** - Kling generates ambient sound and speech directly, no separate voiceover needed
- **Higher quality** - O3 Pro model produces more realistic, detailed video
- **Simpler workflow** - One step: write a prompt, get video with audio
- **Character support** - Reference your existing Human or Product assets

### Audio Modes

**Native (default):** Kling O3 Pro generates audio alongside the video. Best for ambient scenes, product demos with natural sound, and short-form content where you want AI-generated speech and effects.

**Voiceover:** Your pre-created voiceover is merged with the generated video. Create a voiceover first, then reference it. Best when you need precise script control.

### Optional Background Music

Add AI-generated background music to either audio mode. Specify a style hint like "upbeat pop" or "chill lo-fi" and Gruvi generates a matching track mixed at low volume behind your main audio.

### How to Use

1. Choose "UGC Premium" video type
2. Write a detailed prompt describing the scene
3. Select duration (5-15 seconds)
4. Choose audio mode (native or voiceover)
5. Optionally select characters/products
6. Optionally enable background music
7. Generate

### Premium Prompt Examples

```
Woman in her 20s holding up a new skincare serum,
examining the bottle, applying a drop to her hand,
reacting positively. Clean bathroom, soft natural lighting.
```

```
Person unboxing a sleek pair of wireless earbuds,
testing the fit, nodding along to music with a satisfied expression.
Modern desk setup with warm ambient lighting.
```

---

## Output Formats

- **Vertical (9:16)** - TikTok, Reels, Shorts
- **Square (1:1)** - Instagram Feed, Facebook
- **Horizontal (16:9)** - YouTube, Ads

## Tips

1. **Keep it short** - 15-30s performs best
2. **Natural hooks** - Start mid-action or mid-sentence
3. **Show don't tell** - Demonstrate the product
4. **Authentic reactions** - Not over-the-top
5. **Good lighting prompt** - Mention "well-lit", "natural lighting"
