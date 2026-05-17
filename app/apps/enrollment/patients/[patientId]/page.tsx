import { notFound } from 'next/navigation';

import PatientDetail from '~/components/csu/PatientDetail';
import { findPatientById } from '~/data/patients';

export default function PatientDetailPage({
  params,
  searchParams,
}: {
  params: { patientId: string };
  searchParams?: { user?: string };
}) {
  const patient = findPatientById(params.patientId);

  if (!patient) {
    notFound();
  }

  return <PatientDetail patient={patient} user={searchParams?.user || 'demo.agent'} />;
}
