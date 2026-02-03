# Content Scheduling

Plan and automate your content calendar.

## Overview

Gruvi's scheduling system lets you:
- Queue content for future posting
- Coordinate across platforms
- Maintain consistent posting cadence
- View and manage upcoming posts

## How Scheduling Works

1. **Create content** - Generate your video
2. **Set schedule** - Choose date, time, platforms
3. **Queue** - Content enters the schedule
4. **Auto-publish** - Gruvi posts at the scheduled time

Behind the scenes, Gruvi uses AWS EventBridge for reliable, time-based execution.

## Setting a Schedule

### From Library

1. Go to **Library**
2. Select a video
3. Click **Schedule**
4. Configure:
   - **Platforms**: Select one or multiple
   - **Date**: When to post
   - **Time**: Specific time (in your timezone)
   - **Metadata**: Title, description, hashtags per platform
5. Click **Schedule**

### During Video Creation

1. After video generates, click **Schedule** instead of **Publish**
2. Same configuration options
3. Video goes directly to queue

## Viewing Your Schedule

### Calendar View

- See all scheduled posts on a calendar
- Click any date to see posts
- Drag and drop to reschedule

### List View

- Chronological list of upcoming posts
- Filter by platform
- Quick edit access

## Managing Scheduled Posts

### Edit Scheduled Post

1. Find post in schedule
2. Click **Edit**
3. Modify metadata or timing
4. Save changes

### Reschedule

1. Find post in schedule
2. Click **Reschedule**
3. Select new date/time
4. Confirm

### Cancel

1. Find post in schedule
2. Click **Cancel**
3. Confirm cancellation
4. Content returns to Library (not deleted)

## Content Calendar Strategy

### Recommended Cadence

| Platform | Suggested Frequency |
|----------|---------------------|
| TikTok | 1-3x per day |
| Instagram Reels | 1-2x per day |
| YouTube Shorts | 1x per day |
| YouTube Long-form | 1-2x per week |
| LinkedIn | 1x per day (weekdays) |

### Content Mix

A balanced week might include:
- Monday: Educational/How-to
- Tuesday: Product showcase
- Wednesday: Behind-the-scenes
- Thursday: User testimonial style
- Friday: Entertaining/Trending
- Weekend: Evergreen/Repurposed

### Batch Creation

Efficient workflow:
1. Create week's content in one session
2. Schedule all posts
3. Review and adjust
4. Monitor performance
5. Repeat

## Optimal Timing

### General Guidelines

| Platform | Peak Hours |
|----------|------------|
| TikTok | Early AM, Lunch, Evening |
| Instagram | Late morning, Dinner time |
| YouTube | Afternoon |
| LinkedIn | Business hours |

### Finding Your Best Times

1. Check platform analytics
2. Note when your posts perform best
3. Adjust schedule accordingly
4. Test different times
5. Optimize over time

## Multi-Platform Coordination

### Same Content, Different Times

Post the same video to multiple platforms at optimal times for each:

| Time | Platform |
|------|----------|
| 7:00 AM | TikTok |
| 11:00 AM | Instagram Reels |
| 2:00 PM | YouTube Shorts |
| 5:00 PM | LinkedIn |

### Platform-Specific Variations

Create slight variations for each platform:
- Different hooks
- Platform-specific hashtags
- Adjusted captions

## Rate Limits

To avoid platform penalties:

| Limit | Value |
|-------|-------|
| Max posts per platform per hour | 4 |
| Max daily posts per platform | 10 |
| Minimum gap between posts | 15 minutes |

Gruvi enforces these automatically.

## Tips

1. **Plan ahead** - Schedule at least a week out
2. **Batch create** - Make multiple videos in one session
3. **Stay consistent** - Regular posting beats sporadic bursts
4. **Leave buffer** - Schedule 30 min before ideal time for processing
5. **Monitor and adjust** - Check analytics, refine timing
