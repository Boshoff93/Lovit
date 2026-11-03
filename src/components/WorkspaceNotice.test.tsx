import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import WorkspaceNotice from './WorkspaceNotice';

test('recovery stays disabled while its request is pending and can be retried afterward', async () => {
  let complete!: () => void;
  const retry = jest.fn(() => new Promise<void>(resolve => { complete = resolve; }));
  render(<WorkspaceNotice onRetry={retry}>Your media could not be loaded.</WorkspaceNotice>);
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
  expect(screen.getByRole('button', { name: 'Trying again…' })).toBeDisabled();
  expect(retry).toHaveBeenCalledTimes(1);
  await act(async () => complete());
  await waitFor(() => expect(screen.getByRole('button', { name: 'Try again' })).toBeEnabled());
});
