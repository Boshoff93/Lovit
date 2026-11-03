import { analyticsCount, loadAnalyticsSnapshot, snapshotMetric, SnapshotRow } from './analyticsSnapshot';

const account = (n: number, platform = 'instagram') => ({ accountId: String(n), platform });
test('combined metrics exclude missing values, hidden audiences and incompatible period views', async () => {
  const rows = await loadAnalyticsSnapshot([account(1,'youtube'),account(2,'instagram'),account(3,'facebook'),account(4,'twitter')], 'owner', async url => {
    if (url.includes('/account/stats')) return {data:{subscriberCount: 800,hiddenSubscriberCount:true}};
    if (url.includes('/youtube/')) return {data:{totalPosts:10,totals:{views:100,likes:0,comments:5}}};
    if (url.includes('/facebook/')) return {data:{followers:30,postsAvailable:false,totals:{likes:0,comments:0}}};
    return {data:{followers:url.includes('/instagram/') ? 20 : null, postCount:5, totals:{likes:4,comments:null},insights:{metrics:{views:{value:999}}}}};
  }, new AbortController().signal);
  expect(snapshotMetric(rows,'followers')).toEqual({value:50,reporting:2,eligible:3});
  expect(snapshotMetric(rows,'views')).toEqual({value:100,reporting:1,eligible:1});
  expect(snapshotMetric(rows,'likes')).toEqual({value:8,reporting:3,eligible:4});
  expect(snapshotMetric(rows,'comments')).toEqual({value:5,reporting:1,eligible:4});
  expect(analyticsCount(NaN)).toBeNull(); expect(analyticsCount(-1)).toBeNull(); expect(analyticsCount(null)).toBeNull();
  expect(snapshotMetric([{...rows[0],views:null}] as SnapshotRow[],'views').value).toBeNull();
});

test('snapshot bounds concurrent provider reads and skips duplicates and unsupported channels', async () => {
  let active = 0, maximum = 0, calls = 0;
  const request = async () => { calls++; active++; maximum=Math.max(maximum,active); await new Promise(resolve=>setTimeout(resolve,2)); active--; return {data:{followers:1,totals:{likes:0,comments:0}}}; };
  const rows=await loadAnalyticsSnapshot([...Array.from({length:8},(_,i)=>account(i)),account(0),account(99,'linkedin')], 'owner', request, new AbortController().signal);
  expect(rows).toHaveLength(8); expect(calls).toBe(8); expect(maximum).toBe(3);
});

test('cancellation stops queued accounts and never issues follow-up profile calls', async () => {
  const controller = new AbortController(), pending: ((value: any)=>void)[] = [];
  const request = jest.fn(() => new Promise<any>(resolve=>pending.push(resolve)));
  const result = loadAnalyticsSnapshot(Array.from({length:8},(_,i)=>account(i,'youtube')), 'owner', request, controller.signal);
  controller.abort(); pending.forEach(resolve=>resolve({data:{}}));
  await expect(result).rejects.toThrow('cancelled'); expect(request).toHaveBeenCalledTimes(3);
});

test('failed providers produce unavailable metrics rather than fabricated zero totals', async () => {
  const rows=await loadAnalyticsSnapshot([account(1,'youtube'),account(2)], 'owner', async()=>({error:{status:503}}),new AbortController().signal);
  expect(rows.every(r=>r.unavailable && r.followers===null && r.likes===null && r.comments===null)).toBe(true);
  expect(snapshotMetric(rows,'likes')).toEqual({value:null,reporting:0,eligible:2});
});
