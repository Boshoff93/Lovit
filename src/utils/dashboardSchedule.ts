import type { ScheduledPost } from '../services/api';

export type UpcomingPost = Pick<ScheduledPost, 'scheduleId' | 'scheduledTime' | 'title' | 'platforms'>;
export type ScheduleOverview = {
  upcoming: UpcomingPost[];
  scheduledCount: number;
  attentionCount: number;
  latestAttentionId?: string;
};

export const overviewFreshnessSeconds = 60;

// Also used if the browser is running against a server with the original calendar response.
export function summarizeSchedule(posts: ScheduledPost[], now = Date.now()): ScheduleOverview {
  const recent = now - 7 * 24 * 60 * 60 * 1000;
  const upcoming: { time: number; post: UpcomingPost }[] = [];
  let latestAttentionId: string | undefined;
  let latestAttentionTime = -Infinity;
  let attentionCount = 0;

  for (const post of posts) {
    const time = Date.parse(post.scheduledTime);
    if (!Number.isFinite(time)) continue;
    if (post.status === 'scheduled' && post.provisioningStatus !== 'pending' && time > now) {
      const { scheduleId, scheduledTime, title, platforms } = post;
      upcoming.push({ time, post: { scheduleId, scheduledTime, title, platforms } });
    }
    if (time < recent || time > now) continue;
    const failed = ['failed', 'rejected'].includes(post.status) ||
      (post.status === 'partial' && (!post.uploadResults?.length ||
        post.uploadResults.some(result => !result.success &&
          (!result.status || result.status === 'failed'))));
    const needsReview = post.status === 'pending_reconciliation' || (post.status === 'partial' &&
      post.uploadResults?.some(result => result.status === 'pending_reconciliation'));
    if (!failed && !needsReview) continue;
    attentionCount++;
    if (time > latestAttentionTime) {
      latestAttentionTime = time;
      latestAttentionId = post.scheduleId;
    }
  }
  return {
    scheduledCount: upcoming.length,
    upcoming: upcoming.sort((a, b) => a.time - b.time).slice(0, 5).map(item => item.post),
    attentionCount,
    latestAttentionId,
  };
}
