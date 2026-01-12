import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { SectionHeaders, getNicheHeaders, parseRoute, defaultHeaders } from '../config/sectionHeaders';

/**
 * Hook to get dynamic section headers based on current route
 *
 * @returns SectionHeaders object with niche-specific titles and subtitles
 *
 * @example
 * const headers = useSectionHeaders();
 * <h1>{headers.hero.title}</h1>
 * <p>{headers.hero.subtitle}</p>
 */
export function useSectionHeaders(): SectionHeaders {
  const location = useLocation();

  const headers = useMemo(() => {
    const { type, param } = parseRoute(location.pathname);

    if (type === 'default') {
      return defaultHeaders;
    }

    return getNicheHeaders(type, param);
  }, [location.pathname]);

  return headers;
}
