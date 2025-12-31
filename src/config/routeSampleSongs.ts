// Simple hash function to pick a song index (0, 1, or 2) based on route
function hashRoute(route: string): number {
  let hash = 0;
  for (let i = 0; i < route.length; i++) {
    const char = route.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) % 3;
}

// Get song index for a specific genre on a given route
export function getSongIndexForRoute(route: string, genreId: string): number {
  // Combine route and genre for more variation
  return hashRoute(route + genreId);
}






