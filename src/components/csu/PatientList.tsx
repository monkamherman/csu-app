'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import { patientRecords } from '~/data/patients';
import { useLocale } from '~/providers/LocaleProvider';

export default function PatientList({ user }: { user: string }) {
  const { dictionary } = useLocale();
  const statuses: string[] = [dictionary.enrollment.patientList.allStatuses, 'Paye', 'En attente', 'Partiel'];
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>(dictionary.enrollment.patientList.allStatuses);
  const [region, setRegion] = useState<string>(dictionary.enrollment.patientList.allRegions);
  const allRegionsLabel: string = dictionary.enrollment.patientList.allRegions;

  const regions = useMemo(
    (): string[] => [allRegionsLabel, ...Array.from(new Set(patientRecords.map((patient) => patient.region)))],
    [allRegionsLabel],
  );

  const filteredPatients = useMemo(() => {
    const needle = search.toLowerCase().trim();

    return patientRecords.filter((patient) => {
      const matchesStatus =
        status === dictionary.enrollment.patientList.allStatuses || patient.paymentStatus === status;
      const matchesRegion = region === dictionary.enrollment.patientList.allRegions || patient.region === region;
      const haystack = [patient.patientCode, patient.firstName, patient.lastName, patient.programLabel, patient.village]
        .join(' ')
        .toLowerCase();

      return matchesStatus && matchesRegion && (!needle || haystack.includes(needle));
    });
  }, [
    dictionary.enrollment.patientList.allRegions,
    dictionary.enrollment.patientList.allStatuses,
    region,
    search,
    status,
  ]);

  const query = `?user=${encodeURIComponent(user)}`;

  return (
    <section className="space-y-6">
      <div className="rounded-[36px] border border-border bg-white p-8 shadow-card">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primary">
              {dictionary.enrollment.patientList.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-5xl">
              {dictionary.enrollment.patientList.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
              {dictionary.enrollment.patientList.description}
            </p>
          </div>
          <Link href={`/apps/enrollment/new${query}`} className="btn btn-primary">
            {dictionary.enrollment.cards.newTitle}
          </Link>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">{dictionary.common.search}</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="input pl-11"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={dictionary.enrollment.patientList.searchPlaceholder}
              />
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">{dictionary.common.paymentStatus}</span>
            <select className="input" value={status} onChange={(event) => setStatus(event.target.value)}>
              {statuses.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">{dictionary.common.region}</span>
            <select className="input" value={region} onChange={(event) => setRegion(event.target.value)}>
              {regions.map((option) => (
                <option key={option} value={option}>
                  {option.replaceAll('_', ' ')}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="overflow-hidden rounded-[32px] border border-border bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-surface-alt">
              <tr className="text-left text-sm text-muted-foreground">
                <th className="px-6 py-4 font-semibold">{dictionary.enrollment.patientList.table.patient}</th>
                <th className="px-6 py-4 font-semibold">{dictionary.enrollment.patientList.table.program}</th>
                <th className="px-6 py-4 font-semibold">{dictionary.enrollment.patientList.table.location}</th>
                <th className="px-6 py-4 font-semibold">{dictionary.enrollment.patientList.table.payment}</th>
                <th className="px-6 py-4 font-semibold">{dictionary.enrollment.patientList.table.validity}</th>
                <th className="px-6 py-4 font-semibold" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-surface-alt/50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-foreground">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <p className="mt-1 text-muted-foreground">{patient.patientCode}</p>
                  </td>
                  <td className="px-6 py-4 text-foreground">{patient.programLabel}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {patient.region.replaceAll('_', ' ')} / {patient.arrondissement}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-surface-alt px-3 py-1 text-xs font-semibold text-foreground">
                      {patient.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{patient.validUntil}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/apps/enrollment/patients/${patient.id}${query}`}
                      className="text-sm font-semibold text-primary"
                    >
                      {dictionary.enrollment.patientList.table.detail}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
