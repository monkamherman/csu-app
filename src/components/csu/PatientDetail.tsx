'use client';

import Link from 'next/link';
import { ArrowLeft, BadgeDollarSign, MapPinned, ReceiptText, ShieldCheck } from 'lucide-react';

import type { PatientRecord } from '~/data/patients';

export default function PatientDetail({ patient, user }: { patient: PatientRecord; user: string }) {
  const query = `?user=${encodeURIComponent(user)}`;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href={`/apps/enrollment/patients${query}`} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Retour a la liste
        </Link>
        <Link href={`/apps/enrollment/new${query}`} className="btn btn-primary">
          Nouvel enrolement
        </Link>
      </div>

      <div className="overflow-hidden rounded-[36px] bg-gradient-to-br from-primary to-primary-strong p-8 text-white shadow-card">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-white/72">Fiche patient</p>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">
              {patient.firstName} {patient.lastName}
            </h2>
            <p className="mt-3 text-base text-white/80">
              {patient.patientCode} • {patient.gender} • {patient.age} ans
            </p>
          </div>
          <div className="rounded-3xl border border-white/14 bg-white/10 px-5 py-4">
            <p className="text-sm text-white/70">Statut paiement</p>
            <p className="mt-2 text-2xl font-bold">{patient.paymentStatus}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-[32px] border border-border bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <MapPinned className="h-5 w-5 text-primary" />
            <p className="font-semibold text-foreground">Provenance</p>
          </div>
          <div className="mt-5 space-y-2 text-sm text-muted-foreground">
            <p>Region: {patient.region.replaceAll('_', ' ')}</p>
            <p>Departement: {patient.department.replaceAll('_', ' ')}</p>
            <p>Arrondissement: {patient.arrondissement}</p>
            <p>Village: {patient.village}</p>
          </div>
        </div>

        <div className="rounded-[32px] border border-border bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-secondary" />
            <p className="font-semibold text-foreground">Programme CSU</p>
          </div>
          <div className="mt-5 space-y-2 text-sm text-muted-foreground">
            <p>Code: {patient.programCode}</p>
            <p className="font-medium text-foreground">{patient.programLabel}</p>
            <p>Date d enrolement: {patient.createdAt}</p>
            <p>Valide jusqu au: {patient.validUntil}</p>
          </div>
        </div>

        <div className="rounded-[32px] border border-border bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <BadgeDollarSign className="h-5 w-5 text-tertiary" />
            <p className="font-semibold text-foreground">Paiement</p>
          </div>
          <div className="mt-5 space-y-2 text-sm text-muted-foreground">
            <p>Montant: {patient.amount} FCFA</p>
            <p>Moyen: {patient.paymentMethod}</p>
            <p>Recu: {patient.receiptNumber || 'Non renseigne'}</p>
            <p>Statut: {patient.paymentStatus}</p>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-border bg-white p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <ReceiptText className="h-5 w-5 text-primary" />
          <p className="font-semibold text-foreground">Resume operationnel</p>
        </div>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Ce dossier permet au superviseur de verifier la coherence entre provenance, programme d affiliation et trace de paiement avant validation finale du benefice CSU.
        </p>
      </div>
    </section>
  );
}
