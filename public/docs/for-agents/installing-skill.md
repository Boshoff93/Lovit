# Installing the Gruvi Skill

Step-by-step guide to enable your AI agent to use Gruvi.

## For Claude Code (CLI)

Claude Code supports skills - specialized knowledge that extends Claude's capabilities.

### Automatic Install

Tell Claude:
```
Install the gruvi skill from https://agentgruvi.com/skill.md
```

Claude will download and configure the skill automatically.

### Manual Install

1. **Create the skill directory:**
```bash
mkdir -p ~/.claude/skills/gruvi
```

2. **Download the skill file:**
```bash
curl -o ~/.claude/skills/gruvi/SKILL.md https://agentgruvi.com/skill.md
```

3. **Verify installation:**
```bash
cat ~/.claude/skills/gruvi/SKILL.md | head -20
```

4. **Tell Claude about your API key:**
```
Use the gruvi skill. My API key is gruvi_agent_xxxx
```

### Updating the Skill

To get the latest version:
```bash
curl -o ~/.claude/skills/gruvi/SKILL.md https://agentgruvi.com/skill.md
```

## For Claude.ai (Web)

Claude.ai doesn't support persistent skills, but you can:

1. **Start a new Project** with the API docs as context
2. **Copy the skill documentation** into your conversation
3. **Use Projects** to save the configuration

### Using Projects

1. Create a new Project in Claude.ai
2. Add the API reference as a document
3. Add instructions: "You have access to the Gruvi API for content creation"
4. Include your API key in project instructions (private projects only)

## For ChatGPT

### Using Custom GPTs

1. Create a new GPT at chat.openai.com
2. Add the Gruvi API schema (OpenAPI spec)
3. Configure authentication with your API key
4. Enable web browsing for status checking

### Using ChatGPT Directly

Share the API reference in your conversation:
```
I want you to use the Gruvi API to create content.
API Base: https://api.gruvimusic.com
API Key: gruvi_agent_xxxx (use as Bearer token)

[Paste API reference here]
```

## For Other Agents

Any AI agent that can make HTTP requests can use Gruvi:

### Required Information

Provide your agent with:

1. **API Base URL:** `https://api.gruvimusic.com`
2. **Authentication:** Bearer token (your Agent Key)
3. **API Documentation:** Link to https://agentgruvi.com/docs/api-reference

### Example Setup Prompt

```
You are a content creation assistant with access to the Gruvi API.

API Configuration:
- Base URL: https://api.gruvimusic.com
- Authentication: Bearer token in Authorization header
- API Key: gruvi_agent_xxxx

Key endpoints:
- POST /api/gruvi/songs/generate - Create music
- POST /api/gruvi/narratives - Create voiceovers
- POST /api/gruvi/videos/generate - Create videos
- POST /api/gruvi/scheduled-posts - Schedule social posts
- GET /api/gruvi/user/me - Check token balance

All generation requests return a job ID. Poll for status until completed.
```

## Verifying Setup

Test that your agent is configured correctly:

```
Check my Gruvi token balance
```

Your agent should call:
```bash
GET /api/gruvi/user/me
Authorization: Bearer gruvi_agent_xxxx
```

And return something like:
```
You have 4,500 tokens remaining on the Scale plan.
```

## Troubleshooting

### "Unauthorized" errors
- Check your API key is correct
- Ensure the key starts with `gruvi_agent_`
- Verify the key hasn't been revoked

### "Rate limited" errors
- You're making too many requests
- Wait 60 seconds and retry
- Consider upgrading your plan

### Agent can't find the skill
- Verify the skill file exists at `~/.claude/skills/gruvi/SKILL.md`
- Check file permissions
- Restart your Claude session

### Generation stuck at "processing"
- Some generations take 2-5 minutes
- Poll status every 30 seconds
- Check for error messages in the response

## Security Best Practices

1. **Create dedicated agent keys** - Don't share your main account credentials
2. **Rotate keys regularly** - Create new keys monthly
3. **Monitor usage** - Check Account for unusual activity
4. **Revoke compromised keys** - If a key is exposed, revoke immediately
5. **Use project-level keys** - Create separate keys for different agents/projects
