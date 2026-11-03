import React from 'react';
import { fireEvent, render, screen, act } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import AnalyticsWorkspaceHeader, { useAnalyticsAccount } from './AnalyticsWorkspaceHeader';
const accounts=[{accountId:'one',platform:'instagram',accountName:'First account'},{accountId:'two',platform:'instagram',accountName:'Second account'}];
function Page() { const {accountId,select}=useAnalyticsAccount(accounts,'instagram'), location=useLocation(); return <><AnalyticsWorkspaceHeader platform="instagram" accounts={accounts} accountId={accountId} onAccountChange={select}/><p data-testid="location">{location.pathname+location.search}</p></>; }
test('direct links select the requested owned account and switching updates the URL', async () => {
  render(<MemoryRouter initialEntries={['/analytics/instagram?account=two']}><Page/></MemoryRouter>);
  expect(screen.getByRole('combobox',{name:/Connected account/})).toHaveTextContent('Second account');
  await act(async()=>{fireEvent.mouseDown(screen.getByRole('combobox',{name:/Connected account/}));});
  fireEvent.click(await screen.findByRole('option',{name:'First account'}));
  expect(screen.getByTestId('location')).toHaveTextContent('?account=one');
  expect(screen.getByRole('navigation',{name:'Breadcrumb'})).toHaveTextContent('Workspace/Analytics/Instagram');
  expect(screen.getByRole('link',{name:'Analytics'})).toHaveAttribute('href','/analytics');
});
test('an unknown account is never selected and every channel remains reachable', () => {
  render(<MemoryRouter initialEntries={['/analytics/instagram?account=someone-else']}><Page/></MemoryRouter>);
  expect(screen.getByRole('combobox',{name:/Connected account/})).toHaveTextContent('First account');
  expect(screen.getByRole('link',{name:/YouTube/})).toHaveAttribute('href','/analytics/youtube');
  expect(screen.getByRole('link',{name:'Connect account'})).toHaveAttribute('href','/settings/connected-accounts');
});
