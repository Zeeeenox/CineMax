export function getGenreColor(genres: string[]): string {
  if (!genres || genres.length === 0) return '#334155'; // Default gray

  const genreColors: Record<string, string> = {
    'Action': '#dc2626',      // Deep Red
    'Sci-Fi': '#2563eb',      // Electric Blue
    'Drama': '#9333ea',       // Purple
    'Comedy': '#ea580c',      // Orange
    'Horror': '#991b1b',      // Dark Crimson
    'Romance': '#ec4899',     // Pink
    'Animation': '#0d9488',   // Teal
    'Fantasy': '#7c3aed',     // Purple
    'Thriller': '#b91c1c',    // Red
    'Adventure': '#0891b2',   // Teal
    'Family': '#14b8a6',      // Teal
    'Mystery': '#7c3aed',     // Purple
  };

  // Return color for the first matching genre
  for (const genre of genres) {
    if (genreColors[genre]) {
      return genreColors[genre];
    }
  }

  return '#334155'; // Default gray
}

export function getGenreGradient(genres: string[]): string {
  const baseColor = getGenreColor(genres);
  return `linear-gradient(135deg, ${baseColor}, ${adjustBrightness(baseColor, -30)})`;
}

function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}
