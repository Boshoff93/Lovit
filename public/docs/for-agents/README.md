# Using Gruvi with AI Agents

Enable your AI assistant (Claude, ChatGPT, or others) to create content for you automatically.

## Why Use AI Agents with Gruvi?

- **Hands-free content creation** - Just describe what you want
- **Consistent scheduling** - Your agent manages your content calendar
- **Multi-platform optimization** - AI adapts content for each platform
- **Scale production** - Create more content without more effort

## Setup Options

### Option 1: Install the Gruvi Skill (Recommended)

If your agent supports skills (like Claude Code), install the Gruvi skill for the best experience.

**For Claude Code users:**
```bash
# Install the skill
cd ~/.claude/skills
git clone https://github.com/gruvi/gruvi-skill.git gruvi

# Or download directly
mkdir -p ~/.claude/skills/gruvi
curl -o ~/.claude/skills/gruvi/SKILL.md https://agentgruvi.com/skill.md
```

Then tell Claude:
> "Use the gruvi skill with my API key: gruvi_agent_xxxx"

See [Installing the Skill](./installing-skill.md) for detailed instructions.

### Option 2: Share Documentation

For any AI agent, simply share these docs:
1. Copy the API reference: https://agentgruvi.com/docs/api-reference
2. Paste into your chat with the AI
3. Provide your Agent Key

### Option 3: Direct API Key

For simple tasks, just tell your agent:
> "Use the Gruvi API at api.gruvimusic.com with this key: gruvi_agent_xxxx"

## Getting Your Agent Key

1. Log in to [agentgruvi.com](https://agentgruvi.com)
2. Go to **Account** → **Agent Keys**
3. Click **Create Agent Key**
4. Name your key (e.g., "Claude Assistant")
5. Copy the key (starts with `gruvi_agent_`)

**Security notes:**
- Agent keys have the same permissions as your account
- Revoke keys anytime from Account settings
- Don't share keys publicly
- Each agent should have its own key

## What Your Agent Can Do

With Gruvi access, your AI agent can:

| Task | Example Prompt |
|------|----------------|
| Create music | "Make an upbeat pop song about my coffee shop" |
| Create voiceovers | "Create a professional voiceover for my product demo" |
| Generate videos | "Make a TikTok video promoting my new app" |
| Create UGC content | "Create a UGC-style review video for my skincare product" |
| Character swap | "Replace the person in this video with my brand mascot" |
| Schedule posts | "Post this video to TikTok and Instagram tomorrow at 3pm" |
| Manage assets | "Create a character asset for our brand mascot" |

## Example Conversations

### Creating a promotional video
```
You: Create a 30-second promotional video for my fitness app "FitFlow"

Agent: I'll create this for you. First, let me generate a voiceover...
[Creates voiceover with hook: "Tired of complicated workout apps?"]
Now generating the UGC video with app screenshots...
[Generates app showcase video]
Done! Here's your video. Want me to schedule it for posting?
```

### Building a content calendar
```
You: Plan a week of content for my e-commerce store

Agent: I'll create a content plan. Let me generate:
- Monday: Product showcase video with music
- Tuesday: UGC-style customer testimonial
- Wednesday: Behind-the-scenes voiceover
- Thursday: Music video for brand anthem
- Friday: Weekend sale announcement

Shall I generate these and schedule them?
```

## Next Steps

- [Installing the Skill](./installing-skill.md) - Full skill setup guide
- [Common Workflows](./workflows.md) - Ready-to-use prompt templates
- [API Reference](../api-reference.md) - Complete endpoint documentation
