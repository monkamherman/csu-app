import type { CsuAppId } from '~/config/csu-apps';

export type CsuProgram = {
  code: string;
  appId: CsuAppId;
  label: string;
  target: string;
  durationWeeksDefault: number;
};

export const csuPrograms: CsuProgram[] = [
  {
    code: 'csu-cst1-cheque-sante-trimestre-2',
    appId: 'enrollment',
    label: 'CSU-CST1 Chèque santé trimestre 2',
    target: 'Femmes enceintes et suivi materno-neonatal',
    durationWeeksDefault: 13,
  },
  {
    code: 'csu-cst2-cheque-sante-post-partum',
    appId: 'enrollment',
    label: 'CSU-CST2 Chèque santé post-partum J0-J42',
    target: 'Meres et nouveau-nes jusqu au 42e jour',
    durationWeeksDefault: 6,
  },
  {
    code: 'csu-e05-paludisme-gratuit',
    appId: 'enrollment',
    label: 'CSU-E05 Prise en charge enfant 0-5 ans',
    target: 'Enfants de 0 a 5 ans',
    durationWeeksDefault: 52,
  },
  {
    code: 'csu-vih-continuite-soins',
    appId: 'hiv',
    label: 'CSU-VIH Continuite des soins',
    target: 'Personnes vivant avec le VIH',
    durationWeeksDefault: 52,
  },
  {
    code: 'csu-tb-prise-en-charge',
    appId: 'enrollment',
    label: 'CSU-TB Prise en charge tuberculose',
    target: 'Patients suivis pour la tuberculose',
    durationWeeksDefault: 26,
  },
  {
    code: 'csu-dialyse-appui-seances',
    appId: 'claims',
    label: 'CSU-DIAL Appui hemodialyse',
    target: 'Patients necessitant des seances de dialyse',
    durationWeeksDefault: 52,
  },
];
