import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CSU App',
    short_name: 'CSU',
    description: 'Plateforme CSU pour l enrolement, les claims et l admission VIH.',
    start_url: '/',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone'],
    orientation: 'portrait',
    scope: '/',
    background_color: '#f4fbf9',
    theme_color: '#006b5f',
    categories: ['medical', 'health', 'government'],
    icons: [
      {
        src: '/minsante.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
    ],
  };
}
