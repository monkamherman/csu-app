'use client';

import { ArrowUpRight, Clock3 } from 'lucide-react';

import { appConfig, type CsuAppId } from '~/config/csu-apps';
import { useLocale } from '~/providers/LocaleProvider';

export default function AppDashboard({ appId }: { appId: CsuAppId }) {
  const { dictionary } = useLocale();
  const config = appConfig[appId];
  const labels = dictionary.apps[appId];
  const Icon = config.icon;

  return (
    <section className="space-y-6">
      <div className={`overflow-hidden rounded-[36px] bg-gradient-to-br ${config.gradient} p-8 text-white shadow-card`}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex rounded-2xl bg-white/12 p-3">
              <Icon className="h-6 w-6" />
            </div>
            <p className="text-sm uppercase tracking-[0.24em] text-white/72">{dictionary.shell.dashboardTitle}</p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight md:text-5xl">{labels.heroTitle}</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/80">{labels.heroDescription}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {config.stats.map((stat, index) => (
              <div
                key={labels.stats[index]}
                className="rounded-3xl border border-white/14 bg-white/10 p-4 backdrop-blur"
              >
                <p className="text-sm text-white/75">{labels.stats[index]}</p>
                <p className="mt-3 text-3xl font-bold">{stat.value}</p>
                <p className="mt-2 text-sm text-white/80">{stat.change}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-border bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">{dictionary.shell.dashboardSubtitle}</p>
              <p className="mt-1 text-sm text-muted-foreground">{labels.description}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${config.accent}`}>
              {dictionary.common.active}
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {labels.actions.map((action) => (
              <button
                key={action}
                type="button"
                className="rounded-3xl border border-border bg-surface-alt p-4 text-left transition hover:border-primary/30 hover:bg-white"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-foreground">{action}</span>
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-border bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <div className={`rounded-2xl p-3 ${config.accent}`}>
              <Clock3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{dictionary.shell.timelineTitle}</p>
              <p className="text-sm text-muted-foreground">{dictionary.shell.timelineSubtitle}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {labels.timeline.map((item) => (
              <div key={item} className="rounded-3xl bg-surface-alt p-4">
                <p className="text-sm leading-6 text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
