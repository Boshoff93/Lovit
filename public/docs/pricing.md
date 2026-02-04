# Pricing & Token Costs

Understanding Gruvi's token-based pricing system.

## Subscription Plans

| Plan | Monthly Tokens | Price | Best For |
|------|----------------|-------|----------|
| **Starter** | 5,000 | $29/mo | Hobbyists, testing |
| **Scale** | 20,000 | $69/mo | Regular creators |
| **Content Engine** | 50,000 | $149/mo | Power users, agencies |

All plans include:
- Unlimited asset creation
- All video styles and features
- Multi-platform publishing
- Scheduling and analytics
- API access and Agent Keys

## Token Costs by Feature

### Music Generation

| Type | Length | Tokens |
|------|--------|--------|
| Standard | Short (30-90s) | 25 |
| Standard | Long (90-180s) | 50 |
| Premium | 30 seconds | 50 |
| Premium | Per additional 30s | +50 |

**Premium features:**
- Exact duration control
- Lyrics on/off toggle
- Higher quality output

### Voiceover Creation

| Type | Tokens |
|------|--------|
| Direct (TTS) | 25 |
| Story (AI narrative) | 25 |
| UGC (hook-driven) | 25 |

Voice change option: +10 tokens

### Video Generation

| Type | Tokens |
|------|--------|
| Still image video | 200 flat |
| Animated video | 50 per second |
| UGC Creator | 100 per 5 seconds |
| App Showcase | 50 per second |

**Example costs:**
- 30-second music video: 1,500 tokens
- 15-second UGC video: 300 tokens
- 60-second cinematic: 3,000 tokens

### Character Swap

| Mode | Tokens |
|------|--------|
| Replace character | 50 per second |
| Replace character + environment | 50 per second |
| Custom prompt | 50 per second |

### Social Publishing

| Action | Tokens |
|--------|--------|
| Generate metadata (title, description, hashtags) | 10 |
| Generate thumbnail | 10 |
| Generate hook | 10 |
| Publish/Schedule | Free |

### Free Operations

These don't use tokens:
- Creating AI Assets (characters, products, places)
- Uploading media (videos, audio)
- Viewing library
- Managing scheduled posts
- Account management

## Token Usage Examples

### Simple TikTok Post
- Song (short): 25 tokens
- Video (30s): 1,500 tokens
- Metadata: 10 tokens
- **Total: 1,535 tokens**

### UGC Product Video
- Voiceover: 25 tokens
- UGC video (15s): 300 tokens
- Metadata: 10 tokens
- Thumbnail: 10 tokens
- **Total: 345 tokens**

### Full Campaign (3 videos)
- 3 songs: 75-150 tokens
- 3 videos (30s each): 4,500 tokens
- 3 metadata sets: 30 tokens
- 3 thumbnails: 30 tokens
- **Total: 4,635-4,710 tokens**

### Weekly Content Calendar
- 14 posts (2/day x 7 days)
- Mix of UGC (cheaper) and music videos
- Estimated: 8,000-15,000 tokens

## Token Management

### Check Balance
```bash
curl -H "Authorization: Bearer $GRUVI_KEY" \
  https://api.gruvimusic.com/api/gruvi/user/me
```

### Track Usage
View detailed usage in **Account** → **Token History**

### Running Low?
- Upgrade your plan for more tokens
- Purchase token packs (coming soon)
- Optimize: Use shorter videos, UGC style (cheaper)

## Cost Optimization Tips

1. **Use UGC videos** - 100 tokens per 5 seconds vs 50 per second for cinematic
2. **Batch metadata** - Generate once, reuse across platforms
3. **Short songs first** - Test with short (25 tokens) before long (50 tokens)
4. **Reuse assets** - Create characters once, use everywhere
5. **Smart scheduling** - Don't regenerate for each platform

## Enterprise & Custom Plans

Need more? Contact sales@agentgruvi.com for:
- Custom token volumes
- Dedicated support
- SLA guarantees
- White-label options
- API rate limit increases

## FAQ

**Do unused tokens roll over?**
No, tokens reset each billing cycle.

**What happens when I run out?**
Generation requests will fail. Upgrade or wait for renewal.

**Can I share tokens across accounts?**
Not currently. Each account has its own token balance.

**Are there refunds for failed generations?**
Yes, if a generation fails due to our error, tokens are refunded automatically.
