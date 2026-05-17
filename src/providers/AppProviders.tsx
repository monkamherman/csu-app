'use client';

import { ThemeProvider } from 'next-themes';

import PwaRegistration from '~/components/pwa/PwaRegistration';
import { LocaleProvider } from '~/providers/LocaleProvider';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      <LocaleProvider>
        <PwaRegistration />
        {children}
      </LocaleProvider>
    </ThemeProvider>
  );
}
