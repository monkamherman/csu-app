'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, BadgeDollarSign, MapPinned, ReceiptText, ShieldCheck } from 'lucide-react';

import type { PatientRecord } from '~/data/patients';
import { useLocale } from '~/providers/LocaleProvider';

export default function PatientDetail({ patient, user }: { patient: PatientRecord; user: string }) {
  const { dictionary } = useLocale();
  const query = `?user=${encodeURIComponent(user)}`;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href={`/apps/enrollment/patients${query}`} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          {dictionary.common.backToList}
        </Link>
        <Link href={`/apps/enrollment/new${query}`} className="btn btn-primary">
          {dictionary.enrollment.cards.newTitle}
        </Link>
      </div>

      <div className="overflow-hidden rounded-[36px] bg-gradient-to-br from-primary to-primary-strong p-8 text-white shadow-card">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-white/72">{dictionary.enrollment.patientDetail.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">
              {patient.firstName} {patient.lastName}
            </h2>
            <p className="mt-3 text-base text-white/80">
              {patient.patientCode} • {patient.gender} • {patient.age} ans
            </p>
          </div>
          <div className="relative h-24 w-24 overflow-hidden rounded-3xl border border-white/15">
            <Image src="/minsante2.jpeg" alt="MINSANTE" fill className="object-cover" />
          </div>
          <div className="rounded-3xl border border-white/14 bg-white/10 px-5 py-4">
            <p className="text-sm text-white/70">{dictionary.common.paymentStatus}</p>
            <p className="mt-2 text-2xl font-bold">{patient.paymentStatus}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-[32px] border border-border bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <MapPinned className="h-5 w-5 text-primary" />
            <p className="font-semibold text-foreground">{dictionary.enrollment.patientDetail.originTitle}</p>
          </div>
          <div className="mt-5 space-y-2 text-sm text-muted-foreground">
            <p>{dictionary.common.region}: {patient.region.replaceAll('_', ' ')}</p>
            <p>{dictionary.common.department}: {patient.department.replaceAll('_', ' ')}</p>
            <p>{dictionary.common.arrondissement}: {patient.arrondissement}</p>
            <p>{dictionary.common.village}: {patient.village}</p>
          </div>
        </div>

        <div className="rounded-[32px] border border-border bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-secondary" />
            <p className="font-semibold text-foreground">{dictionary.enrollment.patientDetail.programTitle}</p>
          </div>
          <div className="mt-5 space-y-2 text-sm text-muted-foreground">
            <p>{dictionary.enrollment.step2.programCode}: {patient.programCode}</p>
            <p className="font-medium text-foreground">{patient.programLabel}</p>
            <p>{dictionary.enrollment.patientDetail.enrolledAt}: {patient.createdAt}</p>
            <p>{dictionary.enrollment.patientDetail.validUntil}: {patient.validUntil}</p>
          </div>
        </div>

        <div className="rounded-[32px] border border-border bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <BadgeDollarSign className="h-5 w-5 text-tertiary" />
            <p className="font-semibold text-foreground">{dictionary.enrollment.patientDetail.paymentTitle}</p>
          </div>
          <div className="mt-5 space-y-2 text-sm text-muted-foreground">
            <p>{dictionary.common.amount}: {patient.amount} FCFA</p>
            <p>{dictionary.enrollment.patientDetail.method}: {patient.paymentMethod}</p>
            <p>{dictionary.common.receiptNumber}: {patient.receiptNumber || dictionary.enrollment.patientDetail.notProvided}</p>
            <p>{dictionary.enrollment.patientDetail.status}: {patient.paymentStatus}</p>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-border bg-white p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <ReceiptText className="h-5 w-5 text-primary" />
          <p className="font-semibold text-foreground">{dictionary.enrollment.patientDetail.summaryTitle}</p>
        </div>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          {dictionary.enrollment.patientDetail.summaryDescription}
        </p>
      </div>
    </section>
  );
}
