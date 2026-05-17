import { notFound } from 'next/navigation';

import AppDashboard from '~/components/csu/AppDashboard';
import EnrollmentDashboard from '~/components/csu/EnrollmentDashboard';
import { appIds, type CsuAppId } from '~/config/csu-apps';

export default function AppPage({
  params,
  searchParams,
}: {
  params: { appId: string };
  searchParams?: { user?: string };
}) {
  const appId = params.appId as CsuAppId;

  if (!appIds.includes(appId)) {
    notFound();
  }

  if (appId === 'enrollment') {
    return <EnrollmentDashboard user={searchParams?.user || 'demo.agent'} />;
  }

  return <AppDashboard appId={appId} />;
}
