import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '../src/theme';
import { StaticSeoContext } from '../src/utils/seoHelper';
import HomePage from '../src/pages/HomePage';
import PaymentPage from '../src/pages/PaymentPage';
import DistributionDocsPage from '../src/pages/docs/DistributionDocsPage';
import TermsPage from '../src/pages/TermsPage';
import PrivacyPage from '../src/pages/PrivacyPage';

export const publicRoutes = ['/', '/pricing', '/docs', '/docs/getting-started', '/docs/agent-integration', '/docs/api-reference', '/docs/social', '/terms', '/privacy'];

export function renderPublicPage(path) {
  if (!publicRoutes.includes(path)) throw new Error(`Not a public route: ${path}`);
  const Component = path === '/' ? HomePage : path === '/pricing' ? PaymentPage : path === '/terms' ? TermsPage : path === '/privacy' ? PrivacyPage : DistributionDocsPage;
  const state = { auth: { user: null, token: null, subscription: null, allowances: null, isLoading: false, error: null } };
  const store = configureStore({ reducer: () => state });
  const metadata = {};
  const markup = renderToString(
    <StaticSeoContext.Provider value={metadata}>
      <Provider store={store}>
        <MemoryRouter initialEntries={[path]}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    </StaticSeoContext.Provider>,
  );
  if (!metadata.current?.title) throw new Error(`Missing public metadata: ${path}`);
  return { markup, metadata: metadata.current };
}
