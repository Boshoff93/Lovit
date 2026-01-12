/**
 * React Hook for Tab-Specific Dynamic Headers
 *
 * Detects the current pathname and returns appropriate headers
 * for AI Music, AI Video Shorts, Social Media, and Pricing pages.
 */

import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getAIMusicHeaders,
  getAIVideoShortsHeaders,
  getSocialMediaHeaders,
  getPricingHeaders,
  type TabHeaders,
} from '../config/tabHeaders';

export function useTabHeaders(): TabHeaders {
  const location = useLocation();

  const headers = useMemo(() => {
    const pathname = location.pathname;

    // AI Music page headers
    if (pathname.startsWith('/ai-music')) {
      return getAIMusicHeaders(pathname);
    }

    // AI Video Shorts page headers
    if (pathname.startsWith('/ai-video-shorts')) {
      return getAIVideoShortsHeaders(pathname);
    }

    // Social Media page headers
    if (pathname.startsWith('/social-media')) {
      return getSocialMediaHeaders(pathname);
    }

    // Pricing page headers
    if (pathname.startsWith('/pricing')) {
      return getPricingHeaders(pathname);
    }

    // Default fallback (shouldn't reach here if used correctly)
    return {
      badge: 'Gruvi AI',
      titlePrefix: 'Create with ',
      titleHighlight: 'AI',
      titleSuffix: '',
      subtitle: 'Generate music and videos with artificial intelligence.',
    };
  }, [location.pathname]);

  return headers;
}
