'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react';

import LanguageSwitcher from '~/components/csu/LanguageSwitcher';
import { appConfig, appIds, type CsuAppId } from '~/config/csu-apps';
import { useLocale } from '~/providers/LocaleProvider';

export default function LoginScreen() {
  const router = useRouter();
  const { dictionary } = useLocale();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();
    params.set('user', username || 'demo.agent');
    router.push(`/apps/enrollment?${params.toString()}`);
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,107,95,0.22),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(0,159,227,0.18),_transparent_30%),linear-gradient(135deg,_#f4fbf9_0%,_#eef6fb_48%,_#ffffff_100%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">{dictionary.login.eyebrow}</p>
            <h1 className="font-display text-2xl font-bold text-foreground">{dictionary.common.appName}</h1>
          </div>
          <LanguageSwitcher />
        </header>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <section className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 py-2 text-sm text-muted-foreground shadow-soft backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>{dictionary.common.ministry}</span>
            </div>

            <div className="max-w-2xl space-y-4">
              <h2 className="font-display text-4xl font-bold leading-tight text-foreground md:text-6xl">
                {dictionary.login.title}
              </h2>
              <p className="text-lg leading-8 text-muted-foreground">{dictionary.login.description}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {appIds.map((appId) => {
                const Icon = appConfig[appId].icon;
                const labels = dictionary.apps[appId as CsuAppId];

                return (
                  <Link
                    key={appId}
                    href={`/apps/${appId}`}
                    className="group rounded-3xl border border-border bg-white/78 p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-card"
                  >
                    <div className={`mb-4 inline-flex rounded-2xl p-3 ${appConfig[appId].accent}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">{labels.name}</h3>
                    <p className="mb-4 text-sm leading-6 text-muted-foreground">{labels.description}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      {dictionary.common.open}
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="rounded-[32px] border border-border bg-white/88 p-6 shadow-card backdrop-blur md:p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                  {dictionary.login.quickAccessTitle}
                </p>
                <h3 className="font-display text-3xl font-bold text-foreground">{dictionary.login.submit}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{dictionary.login.helper}</p>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-foreground">{dictionary.login.userLabel}</span>
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="csu.operator"
                  className="input"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-foreground">{dictionary.login.passwordLabel}</span>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="input pl-11"
                  />
                </div>
              </label>

              <button type="submit" className="btn btn-primary w-full">
                {dictionary.login.submit}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
