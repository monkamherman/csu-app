'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FilePlus2, ListFilter, Users2 } from 'lucide-react';

import { patientRecords } from '~/data/patients';
import { useLocale } from '~/providers/LocaleProvider';

export default function EnrollmentDashboard({ user }: { user: string }) {
  const { dictionary } = useLocale();
  const totalPatients = patientRecords.length;
  const paidPatients = patientRecords.filter((patient) => patient.paymentStatus === 'Paye').length;
  const pendingPatients = patientRecords.filter((patient) => patient.paymentStatus !== 'Paye').length;

  const query = `?user=${encodeURIComponent(user)}`;

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-[36px] bg-gradient-to-br from-primary to-primary-strong p-8 text-white shadow-card">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.24em] text-white/72">{dictionary.enrollment.heroEyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">{dictionary.enrollment.dashboardTitle}</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/80">
              {dictionary.enrollment.dashboardDescription}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:max-w-xl">
            <div className="rounded-3xl border border-white/14 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-white/75">{dictionary.enrollment.stats.total}</p>
              <p className="mt-3 text-3xl font-bold">{totalPatients}</p>
            </div>
            <div className="rounded-3xl border border-white/14 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-white/75">{dictionary.enrollment.stats.paid}</p>
              <p className="mt-3 text-3xl font-bold">{paidPatients}</p>
            </div>
            <div className="rounded-3xl border border-white/14 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-white/75">{dictionary.enrollment.stats.pending}</p>
              <p className="mt-3 text-3xl font-bold">{pendingPatients}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[32px] border border-border bg-white shadow-soft">
          <div className="relative h-full min-h-[300px]">
            <Image src="/csu.jpeg" alt="CSU Cameroun" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.24em] text-white/70">{dictionary.common.ministry}</p>
              <p className="mt-3 max-w-lg text-sm leading-6 text-white/85">
                {dictionary.enrollment.dashboardDescription}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <Link
            href={`/apps/enrollment/new${query}`}
            className="rounded-[32px] border border-border bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card"
          >
            <FilePlus2 className="h-10 w-10 text-primary" />
            <h3 className="mt-5 font-display text-2xl font-bold text-foreground">
              {dictionary.enrollment.cards.newTitle}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{dictionary.enrollment.cards.newDescription}</p>
          </Link>

          <Link
            href={`/apps/enrollment/patients${query}`}
            className="rounded-[32px] border border-border bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card"
          >
            <Users2 className="h-10 w-10 text-secondary" />
            <h3 className="mt-5 font-display text-2xl font-bold text-foreground">
              {dictionary.enrollment.cards.listTitle}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {dictionary.enrollment.cards.listDescription}
            </p>
          </Link>

          <div className="rounded-[32px] border border-border bg-white p-6 shadow-soft">
            <ListFilter className="h-10 w-10 text-tertiary" />
            <h3 className="mt-5 font-display text-2xl font-bold text-foreground">
              {dictionary.enrollment.cards.opsTitle}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {dictionary.enrollment.cards.opsDescription
                .replace('{paid}', String(paidPatients))
                .replace('{pending}', String(pendingPatients))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
