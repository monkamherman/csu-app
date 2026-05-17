import type { Metadata, Viewport } from 'next';

import { SITE } from '~/config.js';
import AppProviders from '~/providers/AppProviders';

import '~/assets/styles/base.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.origin),
  title: {
    default: SITE.title,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: SITE.name,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo-blanc.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#006b5f',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
