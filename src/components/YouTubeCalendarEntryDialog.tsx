import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { isAxiosError } from 'axios';
import WorkspaceNotice from './WorkspaceNotice';
import { scheduledPostsApi, ScheduledPost } from '../services/api';

type Props = {
  accounts: { accountId: string; accountName?: string; username?: string }[];
  onClose: () => void;
  onSaved: (post: ScheduledPost) => void;
};

export default function YouTubeCalendarEntryDialog({ accounts, onClose, onSaved }: Props) {
  const [accountId, setAccountId] = useState('');
  const [title, setTitle] = useState('');
  const [postUrl, setPostUrl] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const selectedAccount = accountId || accounts[0]?.accountId || '';

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedAccount || saving) return;
    const scheduledTime = new Date(dateTime);
    if (!Number.isFinite(scheduledTime.getTime())) {
      setError('Enter the date and time shown in YouTube.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const { data } = await scheduledPostsApi.addYouTubeCalendarEntry({
        accountId: selectedAccount,
        title: title.trim(),
        postUrl: postUrl.trim(),
        scheduledTime: scheduledTime.toISOString(),
      });
      onSaved(data.scheduledPost);
    } catch (err) {
      setError(isAxiosError(err) && err.response?.data?.error
        ? err.response.data.error
        : 'The YouTube entry could not be saved. Try again with the same link.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onClose={saving ? undefined : onClose} fullWidth maxWidth="xs"
      aria-labelledby="youtube-entry-title" PaperProps={{ sx: { bgcolor: '#171e28', borderRadius: 4, color: '#fff' } }}>
      <DialogTitle id="youtube-entry-title">Add a YouTube post</DialogTitle>
      <form onSubmit={submit}>
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Add a Community post you scheduled on YouTube. YouTube handles publishing.
            </Typography>
            {accounts.length ? (
              <>
                <TextField select label="YouTube channel" value={selectedAccount}
                  onChange={event => setAccountId(event.target.value)} disabled={saving}>
                  {accounts.map(account => <MenuItem key={account.accountId} value={account.accountId}>
                    {account.accountName || account.username || 'YouTube'}
                  </MenuItem>)}
                </TextField>
                <TextField label="Post title" required value={title} disabled={saving}
                  inputProps={{ maxLength: 500 }} onChange={event => setTitle(event.target.value)} />
                <TextField label="YouTube post link" required type="url" placeholder="https://www.youtube.com/post/…"
                  value={postUrl} disabled={saving} onChange={event => setPostUrl(event.target.value)} />
                <TextField label="Scheduled time (local)" required type="datetime-local" InputLabelProps={{ shrink: true }}
                  value={dateTime} disabled={saving} onChange={event => setDateTime(event.target.value)} />
              </>
            ) : <WorkspaceNotice severity="info">Connect a YouTube channel to add a post to your calendar.</WorkspaceNotice>}
            {error && <WorkspaceNotice>{error}</WorkspaceNotice>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} disabled={saving}>Cancel</Button>
          <Button variant="contained" type="submit" disabled={!selectedAccount || saving || !title.trim() || !postUrl.trim() || !dateTime}>
            {saving ? 'Adding…' : 'Add to calendar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
