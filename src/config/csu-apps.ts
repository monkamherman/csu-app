import { Activity, FileHeart, ShieldPlus } from 'lucide-react';

export const appIds = ['enrollment', 'claims', 'hiv'] as const;

export type CsuAppId = (typeof appIds)[number];

export const appConfig: Record<
  CsuAppId,
  {
    icon: typeof Activity;
    gradient: string;
    accent: string;
    stats: Array<{ value: string; change: string }>;
  }
> = {
  enrollment: {
    icon: ShieldPlus,
    gradient: 'from-primary to-primary-strong',
    accent: 'bg-primary/12 text-primary',
    stats: [
      { value: '1,284', change: '+14%' },
      { value: '86', change: '-8%' },
      { value: '24', change: '+3' },
    ],
  },
  claims: {
    icon: Activity,
    gradient: 'from-secondary to-secondary-strong',
    accent: 'bg-secondary/12 text-secondary',
    stats: [
      { value: '3,942', change: '+9%' },
      { value: '117', change: '-5%' },
      { value: '72%', change: '+11 pts' },
    ],
  },
  hiv: {
    icon: FileHeart,
    gradient: 'from-tertiary to-tertiary-strong',
    accent: 'bg-tertiary/12 text-tertiary',
    stats: [
      { value: '312', change: '+6%' },
      { value: '21', change: '-3%' },
      { value: '94%', change: '+2 pts' },
    ],
  },
};
