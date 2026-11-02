import { describe, expect, it } from '@jest/globals';
import { hasPublishingAccess } from './publishing';
describe('publishing eligibility in the composer', () => {
  const now = 1800000000000;
  it('allows current paid plans and trials', () => {
    expect(hasPublishingAccess({tier:'starter',status:'active',currentPeriodEnd:now/1000+60},now)).toBe(true);
    expect(hasPublishingAccess({tier:'premium',status:'trialing',currentPeriodEnd:now/1000+60},now)).toBe(true);
  });
  it('opens the upsell for free, invalid, inactive, expired or risk-held access', () => {
    for (const subscription of [undefined,{tier:'free',status:'active'}, {tier:'invented',status:'active'}, {tier:'starter',status:'past_due'}, {tier:'starter',status:'active',currentPeriodEnd:now/1000-1}, {tier:'starter',status:'active',currentPeriodEnd:-1}, {tier:'starter',status:'active',accessHold:'charge.refunded'}]) {
      expect(hasPublishingAccess(subscription,now)).toBe(false);
    }
  });
});
