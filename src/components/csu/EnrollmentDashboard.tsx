'use client';

import Link from 'next/link';
import { FilePlus2, ListFilter, Users2 } from 'lucide-react';

import { patientRecords } from '~/data/patients';

export default function EnrollmentDashboard({ user }: { user: string }) {
  const totalPatients = patientRecords.length;
  const paidPatients = patientRecords.filter((patient) => patient.paymentStatus === 'Paye').length;
  const pendingPatients = patientRecords.filter((patient) => patient.paymentStatus !== 'Paye').length;

  const query = `?user=${encodeURIComponent(user)}`;

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-[36px] bg-gradient-to-br from-primary to-primary-strong p-8 text-white shadow-card">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.24em] text-white/72">Enrolement CSU Test</p>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">Dashboard d enrolement patient</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/80">
              Suivi des dossiers, acces rapide a la creation d un patient et consultation des fiches d enrolement.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/14 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-white/75">Patients enroles</p>
              <p className="mt-3 text-3xl font-bold">{totalPatients}</p>
            </div>
            <div className="rounded-3xl border border-white/14 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-white/75">Paiements confirmes</p>
              <p className="mt-3 text-3xl font-bold">{paidPatients}</p>
            </div>
            <div className="rounded-3xl border border-white/14 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-white/75">Dossiers a completer</p>
              <p className="mt-3 text-3xl font-bold">{pendingPatients}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Link href={`/apps/enrollment/new${query}`} className="rounded-[32px] border border-border bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
          <FilePlus2 className="h-10 w-10 text-primary" />
          <h3 className="mt-5 font-display text-2xl font-bold text-foreground">Nouvel enrolement</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Lancer le processus en 3 etapes pour enregistrer un patient, rattacher un programme et confirmer le paiement.
          </p>
        </Link>

        <Link href={`/apps/enrollment/patients${query}`} className="rounded-[32px] border border-border bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
          <Users2 className="h-10 w-10 text-secondary" />
          <h3 className="mt-5 font-display text-2xl font-bold text-foreground">Liste des patients</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Parcourir les dossiers existants, rechercher un patient et filtrer par region, programme ou statut de paiement.
          </p>
        </Link>

        <div className="rounded-[32px] border border-border bg-white p-6 shadow-soft">
          <ListFilter className="h-10 w-10 text-tertiary" />
          <h3 className="mt-5 font-display text-2xl font-bold text-foreground">Vue operationnelle</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Repartition actuelle: {paidPatients} payes, {pendingPatients} avec action en attente. Les routes detaillees sont prêtes pour le suivi quotidien.
          </p>
        </div>
      </div>
    </section>
  );
}
