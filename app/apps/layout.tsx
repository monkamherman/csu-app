import AppShell from '~/components/csu/AppShell';

export default function AppsLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
