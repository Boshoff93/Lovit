export type AnalyticsAccount = { accountId: string; platform: string; accountName?: string; username?: string; avatarUrl?: string };
export const analyticsPlatforms = ['youtube', 'tiktok', 'instagram', 'facebook', 'twitter'];
export type SnapshotRow = AnalyticsAccount & {
  followers: number | null; views: number | null; likes: number | null; comments: number | null;
  posts: number | null; coverage: 'videos' | 'recent_posts'; unavailable: boolean; updatedAt: string;
};
type Request = (url: string) => Promise<{ data?: unknown; error?: unknown }>;
export const analyticsCount = (value: unknown): number | null => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;

/** At most three accounts in flight. Read summaries only, never walk post pagination. */
export async function loadAnalyticsSnapshot(accounts: AnalyticsAccount[], userId: string, request: Request, signal: AbortSignal): Promise<SnapshotRow[]> {
  const unique = accounts.filter((a, i) => analyticsPlatforms.includes(a.platform) && accounts.findIndex(b => b.accountId === a.accountId && b.platform === a.platform) === i);
  const rows = new Array<SnapshotRow>(unique.length);
  let index = 0;
  async function worker() {
    while (index < unique.length && !signal.aborted) {
      const i = index++, account = unique[i], video = ['youtube', 'tiktok'].includes(account.platform);
      const query = new URLSearchParams({ userId, accountId: account.accountId });
      const summaryResult = await request(`/api/gruvi/${account.platform}/analytics/summary?${query}${video ? '' : '&days=28'}`);
      if (signal.aborted) return;
      const statsResult = video ? await request(`/api/gruvi/${account.platform}/account/stats?${query}`) : summaryResult;
      if (signal.aborted) return;
      const summary = summaryResult.data as any, stats = statsResult.data as any;
      const postsAvailable = video ? !!summary : summary?.postsAvailable !== false && !!summary;
      rows[i] = { ...account,
        followers: analyticsCount(video ? account.platform === 'youtube' ? stats?.hiddenSubscriberCount ? null : stats?.subscriberCount : stats?.followerCount : summary?.followers),
        // Meta selected-period views must never be added to video lifetime views.
        views: video ? analyticsCount(summary?.totals?.views) : null,
        likes: postsAvailable ? analyticsCount(summary?.totals?.likes) : null,
        comments: postsAvailable ? analyticsCount(summary?.totals?.comments) : null,
        posts: postsAvailable ? analyticsCount(video ? summary?.totalPosts : summary?.postCount) : null,
        coverage: video ? 'videos' : 'recent_posts', unavailable: !!summaryResult.error || !!statsResult.error,
        updatedAt: summary?.updatedAt || new Date().toISOString(),
      };
    }
  }
  await Promise.all(Array.from({ length: Math.min(3, unique.length) }, worker));
  if (signal.aborted) throw new Error('Analytics request cancelled.');
  return rows;
}

export function snapshotMetric(rows: SnapshotRow[], key: 'followers' | 'views' | 'likes' | 'comments') {
  const eligible = key === 'views' ? rows.filter(r => r.coverage === 'videos') : key === 'followers' ? rows.filter(r => r.platform !== 'twitter') : rows;
  const values = eligible.map(r => r[key]).filter((v): v is number => v !== null);
  return { value: values.length ? values.reduce((a, b) => a + b, 0) : null, reporting: values.length, eligible: eligible.length };
}
