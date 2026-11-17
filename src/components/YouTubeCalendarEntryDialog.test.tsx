import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { scheduledPostsApi, ScheduledPost } from '../services/api';
import YouTubeCalendarEntryDialog from './YouTubeCalendarEntryDialog';

jest.mock('axios', () => ({ isAxiosError: jest.fn() }));
jest.mock('../services/api', () => ({
  scheduledPostsApi: { addYouTubeCalendarEntry: jest.fn() },
}));

test('records the selected YouTube channel and local scheduled time', async () => {
  const post = { scheduleId: 'youtube-entry' } as ScheduledPost;
  const save = scheduledPostsApi.addYouTubeCalendarEntry as jest.Mock;
  save.mockResolvedValueOnce({ data: { scheduledPost: post } });
  const onSaved = jest.fn();
  render(<YouTubeCalendarEntryDialog accounts={[{ accountId: 'fable', accountName: 'Fable' }]}
    onClose={jest.fn()} onSaved={onSaved} />);
  const url = 'https://www.youtube.com/post/Ugkx12345678';
  fireEvent.change(screen.getByLabelText(/Post title/), { target: { value: 'Goldilocks' } });
  fireEvent.change(screen.getByLabelText(/YouTube post link/), { target: { value: url } });
  fireEvent.change(screen.getByLabelText(/Scheduled time \(local\)/), { target: { value: '2026-11-18T17:30' } });
  fireEvent.click(screen.getByRole('button', { name: 'Add to calendar' }));
  await waitFor(() => expect(onSaved).toHaveBeenCalledWith(post));
  expect(save).toHaveBeenCalledWith({ accountId: 'fable', title: 'Goldilocks', postUrl: url,
    scheduledTime: new Date('2026-11-18T17:30').toISOString() });
});

test('disables adding a post until a YouTube channel is connected', () => {
  render(<YouTubeCalendarEntryDialog accounts={[]} onClose={jest.fn()} onSaved={jest.fn()} />);
  expect(screen.getByText(/Connect a YouTube channel/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Add to calendar' })).toBeDisabled();
});
