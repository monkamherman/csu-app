export type PatientRecord = {
  id: string;
  patientCode: string;
  firstName: string;
  lastName: string;
  gender: 'F' | 'M';
  age: number;
  region: string;
  department: string;
  arrondissement: string;
  village: string;
  programCode: string;
  programLabel: string;
  paymentStatus: 'Paye' | 'En attente' | 'Partiel';
  amount: number;
  paymentMethod: string;
  receiptNumber: string;
  createdAt: string;
  validUntil: string;
};

export const patientRecords: PatientRecord[] = [
  {
    id: 'p-001',
    patientCode: 'CSU-128476',
    firstName: 'Amina',
    lastName: 'Moussa',
    gender: 'F',
    age: 27,
    region: 'Far_North',
    department: 'Mayo_Danay',
    arrondissement: 'Yagoua',
    village: 'Dana',
    programCode: 'csu-cst1-cheque-sante-trimestre-2',
    programLabel: 'CSU-CST1 Chèque santé trimestre 2',
    paymentStatus: 'Paye',
    amount: 6000,
    paymentMethod: 'Mobile Money',
    receiptNumber: 'REC-2026-1001',
    createdAt: '2026-05-10',
    validUntil: '2027-05-10',
  },
  {
    id: 'p-002',
    patientCode: 'CSU-334921',
    firstName: 'Boris',
    lastName: 'Meka',
    gender: 'M',
    age: 4,
    region: 'Centre',
    department: 'Mfoundi',
    arrondissement: 'Yaounde 4',
    village: 'Mvog-Ada',
    programCode: 'csu-e05-paludisme-gratuit',
    programLabel: 'CSU-E05 Prise en charge enfant 0-5 ans',
    paymentStatus: 'Paye',
    amount: 0,
    paymentMethod: 'Exemption',
    receiptNumber: 'AUTO-E05-0042',
    createdAt: '2026-05-12',
    validUntil: '2027-05-12',
  },
  {
    id: 'p-003',
    patientCode: 'CSU-772105',
    firstName: 'Clarisse',
    lastName: 'Ndom',
    gender: 'F',
    age: 31,
    region: 'Littoral',
    department: 'Wouri',
    arrondissement: 'Douala 3',
    village: 'Logbaba',
    programCode: 'csu-cst2-cheque-sante-post-partum',
    programLabel: 'CSU-CST2 Chèque santé post-partum J0-J42',
    paymentStatus: 'En attente',
    amount: 6000,
    paymentMethod: 'Cash',
    receiptNumber: '',
    createdAt: '2026-05-13',
    validUntil: '2027-05-13',
  },
  {
    id: 'p-004',
    patientCode: 'CSU-902347',
    firstName: 'Eric',
    lastName: 'Talla',
    gender: 'M',
    age: 42,
    region: 'West',
    department: 'Mifi',
    arrondissement: 'Bafoussam 1',
    village: 'Tamdja',
    programCode: 'csu-tb-prise-en-charge',
    programLabel: 'CSU-TB Prise en charge tuberculose',
    paymentStatus: 'Partiel',
    amount: 3500,
    paymentMethod: 'Virement bancaire',
    receiptNumber: 'TB-2026-090',
    createdAt: '2026-05-15',
    validUntil: '2026-11-15',
  },
  {
    id: 'p-005',
    patientCode: 'CSU-551084',
    firstName: 'Fatou',
    lastName: 'Abba',
    gender: 'F',
    age: 24,
    region: 'North',
    department: 'Benoue',
    arrondissement: 'Garoua 2',
    village: 'Poumpoumre',
    programCode: 'csu-cst1-cheque-sante-trimestre-2',
    programLabel: 'CSU-CST1 Chèque santé trimestre 2',
    paymentStatus: 'Paye',
    amount: 6000,
    paymentMethod: 'Mobile Money',
    receiptNumber: 'REC-2026-1120',
    createdAt: '2026-05-16',
    validUntil: '2027-05-16',
  },
];

export const findPatientById = (id: string) => patientRecords.find((patient) => patient.id === id);
