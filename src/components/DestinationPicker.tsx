import React from 'react';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { platformNames } from '../config/publishing';

interface Destination {
  accountId: string;
  platform: string;
  accountName?: string;
  username?: string;
}

const platformColors: Record<string, string> = {
  youtube: '#ff6868', instagram: '#ef8fbc', facebook: '#73adff',
  linkedin: '#79bce8', tiktok: '#f0f4f9', twitter: '#f0f4f9',
};

function DestinationIcon({ platform }: { platform: string }) {
  if (platform === 'youtube') return <YouTubeIcon />;
  if (platform === 'instagram') return <InstagramIcon />;
  if (platform === 'facebook') return <FacebookIcon />;
  if (platform === 'linkedin') return <LinkedInIcon />;
  if (platform !== 'tiktok' && platform !== 'twitter') return <LinkRoundedIcon />;
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={platform === 'tiktok'
        ? 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z'
        : 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'} />
    </svg>
  );
}

export default function DestinationPicker({ accounts, selectedIds, disabled, onToggle }: {
  accounts: Destination[];
  selectedIds: string[];
  disabled: boolean;
  onToggle: (accountId: string, checked: boolean) => void;
}) {
  return (
    <div className="gd-destination-list" role="group" aria-label="Publishing destinations">
      {accounts.map(account => {
        const checked = selectedIds.includes(account.accountId);
        const platform = platformNames[account.platform] || account.platform;
        const name = account.accountName || (account.username ? `@${account.username.replace(/^@/, '')}` : account.accountId);
        return (
          <label key={account.accountId} className={`gd-destination-option${checked ? ' is-selected' : ''}${disabled ? ' is-disabled' : ''}`}>
            <input
              type="checkbox"
              name="destinations"
              value={account.accountId}
              aria-label={`${platform} · ${name}`}
              title={`${platform} · ${name}`}
              checked={checked}
              disabled={disabled}
              onChange={event => onToggle(account.accountId, event.target.checked)}
            />
            <span className="gd-destination-platform" style={{ color: platformColors[account.platform] || '#aab4c2' }} aria-hidden="true">
              <DestinationIcon platform={account.platform} />
            </span>
            <span className="gd-destination-identity">
              <strong>{platform}</strong>
              <span title={name}>{name}</span>
            </span>
            <span className="gd-destination-check" aria-hidden="true">
              {checked && <CheckRoundedIcon />}
            </span>
          </label>
        );
      })}
    </div>
  );
}
