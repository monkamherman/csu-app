'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, LogOut } from 'lucide-react';

import LanguageSwitcher from '~/components/csu/LanguageSwitcher';
import PwaInstallButton from '~/components/pwa/PwaInstallButton';
import { appConfig, appIds, type CsuAppId } from '~/config/csu-apps';
import { useLocale } from '~/providers/LocaleProvider';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState('demo.agent');
  const { dictionary } = useLocale();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUser(params.get('user') || 'demo.agent');
  }, []);

  return (
    <div className="min-h-screen bg-app-shell">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6 lg:py-6">
        <aside className="rounded-[32px] border border-border bg-white p-6 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{dictionary.shell.suiteLabel}</p>
              <h1 className="font-display text-2xl font-bold text-foreground">{dictionary.common.appName}</h1>
            </div>
            <LayoutDashboard className="mt-1 h-5 w-5 text-primary" />
          </div>

          <div className="mt-6 rounded-3xl bg-surface-alt p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{dictionary.common.connectedAs}</p>
            <p className="mt-2 text-lg font-semibold text-foreground">{user}</p>
            <p className="mt-1 text-sm text-muted-foreground">{dictionary.common.ministry}</p>
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">{dictionary.shell.navigationTitle}</p>
              <LanguageSwitcher />
            </div>

            <nav className="space-y-2">
              {appIds.map((appId) => {
                const labels = dictionary.apps[appId];
                const Icon = appConfig[appId].icon;
                const active = pathname === `/apps/${appId}` || pathname.startsWith(`/apps/${appId}/`);
                const href = `/apps/${appId}?user=${encodeURIComponent(user)}`;

                return (
                  <Link
                    key={appId}
                    href={href}
                    className={`block rounded-3xl border p-4 transition ${
                      active
                        ? 'border-primary bg-primary text-white shadow-soft'
                        : 'border-border bg-white hover:border-primary/30 hover:bg-surface-alt'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`rounded-2xl p-3 ${active ? 'bg-white/15' : appConfig[appId].accent}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className={`text-base font-semibold ${active ? 'text-white' : 'text-foreground'}`}>{labels.name}</p>
                        <p className={`mt-1 text-sm leading-5 ${active ? 'text-white/75' : 'text-muted-foreground'}`}>
                          {labels.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-6">
            <PwaInstallButton />
          </div>

          <Link href="/" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground">
            <LogOut className="h-4 w-4" />
            {dictionary.common.signOut}
          </Link>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
