import PatientList from '~/components/csu/PatientList';

export default function PatientsPage({
  searchParams,
}: {
  searchParams?: { user?: string };
}) {
  return <PatientList user={searchParams?.user || 'demo.agent'} />;
}
