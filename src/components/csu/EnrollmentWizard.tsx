'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, CreditCard, MapPinned, Sparkles } from 'lucide-react';

import { cameroonLocations } from '~/data/cameroon-locations';
import { csuPrograms } from '~/data/csu-programs';
import { useLocale } from '~/providers/LocaleProvider';

type PaymentMethod = 'cash' | 'mobile_money' | 'bank_transfer' | 'cheque';

type FormState = {
  region: string;
  department: string;
  arrondissement: string;
  village: string;
  patientCode: string;
  programCode: string;
  startDate: string;
  endDate: string;
  healthChequeWeeks: number;
  amount: string;
  paymentMethod: PaymentMethod;
  receiptNumber: string;
  paymentDate: string;
};

const initialStartDate = new Date().toISOString().slice(0, 10);

const addOneYear = (dateValue: string) => {
  const date = new Date(dateValue);
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().slice(0, 10);
};

const createPatientCode = () => {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `CSU-${random}`;
};

const paymentMethods: Array<{ value: PaymentMethod; label: string }> = [
  { value: 'cash', label: 'Cash' },
  { value: 'mobile_money', label: 'Mobile Money' },
  { value: 'bank_transfer', label: 'Virement bancaire' },
  { value: 'cheque', label: 'Cheque' },
];

export default function EnrollmentWizard() {
  const { dictionary } = useLocale();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    region: 'Centre',
    department: 'Mfoundi',
    arrondissement: 'Yaounde 1',
    village: '',
    patientCode: createPatientCode(),
    programCode: csuPrograms[0].code,
    startDate: initialStartDate,
    endDate: addOneYear(initialStartDate),
    healthChequeWeeks: csuPrograms[0].durationWeeksDefault,
    amount: '6000',
    paymentMethod: 'mobile_money',
    receiptNumber: '',
    paymentDate: initialStartDate,
  });

  const departments = useMemo(() => Object.keys(cameroonLocations[form.region] || {}), [form.region]);
  const arrondissements = useMemo(
    () => cameroonLocations[form.region]?.[form.department] || [],
    [form.department, form.region]
  );

  const selectedProgram = useMemo(
    () => csuPrograms.find((program) => program.code === form.programCode) || csuPrograms[0],
    [form.programCode]
  );

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleRegionChange = (region: string) => {
    const nextDepartment = Object.keys(cameroonLocations[region])[0];
    const nextArrondissement = cameroonLocations[region][nextDepartment][0];

    setForm((current) => ({
      ...current,
      region,
      department: nextDepartment,
      arrondissement: nextArrondissement,
    }));
  };

  const handleDepartmentChange = (department: string) => {
    const nextArrondissement = cameroonLocations[form.region][department][0];

    setForm((current) => ({
      ...current,
      department,
      arrondissement: nextArrondissement,
    }));
  };

  const handleProgramChange = (programCode: string) => {
    const nextProgram = csuPrograms.find((program) => program.code === programCode) || csuPrograms[0];

    setForm((current) => ({
      ...current,
      programCode,
      healthChequeWeeks: nextProgram.durationWeeksDefault,
    }));
  };

  const handleStartDateChange = (startDate: string) => {
    setForm((current) => ({
      ...current,
      startDate,
      endDate: addOneYear(startDate),
    }));
  };

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-[36px] bg-gradient-to-br from-primary to-primary-strong p-8 text-white shadow-card">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.24em] text-white/72">Enrolement CSU Test</p>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">
              Processus d enrolement patient en 3 etapes
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/80">
              Provenance du patient, rattachement au programme CSU, puis confirmation du paiement dans un meme flux.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { id: 1, icon: MapPinned, label: 'Provenance' },
              { id: 2, icon: Sparkles, label: 'Programme' },
              { id: 3, icon: CreditCard, label: 'Paiement' },
            ].map((item) => {
              const Icon = item.icon;
              const active = step === item.id;

              return (
                <div key={item.id} className={`rounded-3xl border p-4 ${active ? 'border-white/30 bg-white/18' : 'border-white/10 bg-white/8'}`}>
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/70">Etape {item.id}</p>
                      <p className="font-semibold text-white">{item.label}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[32px] border border-border bg-white p-6 shadow-soft">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Etape 1</p>
                <h3 className="mt-2 font-display text-3xl font-bold text-foreground">Provenance du patient</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Selectionnez le niveau territorial puis preparez l identifiant de reference du patient.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">Region</span>
                  <select className="input" value={form.region} onChange={(event) => handleRegionChange(event.target.value)}>
                    {Object.keys(cameroonLocations).map((region) => (
                      <option key={region} value={region}>
                        {region.replaceAll('_', ' ')}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">Departement</span>
                  <select
                    className="input"
                    value={form.department}
                    onChange={(event) => handleDepartmentChange(event.target.value)}
                  >
                    {departments.map((department) => (
                      <option key={department} value={department}>
                        {department.replaceAll('_', ' ')}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">Arrondissement</span>
                  <select
                    className="input"
                    value={form.arrondissement}
                    onChange={(event) => updateField('arrondissement', event.target.value)}
                  >
                    {arrondissements.map((arrondissement) => (
                      <option key={arrondissement} value={arrondissement}>
                        {arrondissement}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">Village</span>
                  <input
                    className="input"
                    type="text"
                    value={form.village}
                    onChange={(event) => updateField('village', event.target.value)}
                    placeholder="Nom du village"
                  />
                </label>
              </div>

              <div className="rounded-[28px] bg-surface-alt p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-end">
                  <label className="flex-1 space-y-2">
                    <span className="text-sm font-medium text-foreground">Numero patient suggere</span>
                    <input className="input bg-white" type="text" value={form.patientCode} onChange={(event) => updateField('patientCode', event.target.value)} />
                  </label>
                  <button type="button" className="btn" onClick={() => updateField('patientCode', createPatientCode())}>
                    Regenerer
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Etape 2</p>
                <h3 className="mt-2 font-display text-3xl font-bold text-foreground">Association au programme</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Choisissez le programme CSU puis renseignez la fenetre de validite et le nombre de semaines de cheque sante.
                </p>
              </div>

              <label className="space-y-2">
                <span className="text-sm font-medium text-foreground">Programme</span>
                <select className="input" value={form.programCode} onChange={(event) => handleProgramChange(event.target.value)}>
                  {csuPrograms.map((program) => (
                    <option key={program.code} value={program.code}>
                      {program.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-[28px] bg-surface-alt p-5">
                <p className="text-sm font-semibold text-foreground">{selectedProgram.target}</p>
                <p className="mt-1 text-sm text-muted-foreground">Code programme: {selectedProgram.code}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">Date de debut</span>
                  <input className="input" type="date" value={form.startDate} onChange={(event) => handleStartDateChange(event.target.value)} />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">Date de fin</span>
                  <input className="input" type="date" value={form.endDate} onChange={(event) => updateField('endDate', event.target.value)} />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">Nombre de semaines</span>
                  <input
                    className="input"
                    type="number"
                    min="1"
                    max="52"
                    value={form.healthChequeWeeks}
                    onChange={(event) => updateField('healthChequeWeeks', Number(event.target.value))}
                  />
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Etape 3</p>
                <h3 className="mt-2 font-display text-3xl font-bold text-foreground">Confirmation de paiement</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Enregistrez le paiement associe au programme selectionne et conservez la reference du recu.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">Montant</span>
                  <input className="input" type="number" value={form.amount} onChange={(event) => updateField('amount', event.target.value)} />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">Moyen de paiement</span>
                  <select className="input" value={form.paymentMethod} onChange={(event) => updateField('paymentMethod', event.target.value as PaymentMethod)}>
                    {paymentMethods.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">Numero du recu</span>
                  <input
                    className="input"
                    type="text"
                    value={form.receiptNumber}
                    onChange={(event) => updateField('receiptNumber', event.target.value)}
                    placeholder="REC-2026-0001"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">Date de paiement</span>
                  <input className="input" type="date" value={form.paymentDate} onChange={(event) => updateField('paymentDate', event.target.value)} />
                </label>
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <button type="button" className="btn btn-ghost" disabled={step === 1} onClick={() => setStep((current) => Math.max(1, current - 1))}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Retour
            </button>

            {step < 3 ? (
              <button type="button" className="btn btn-primary" onClick={() => setStep((current) => Math.min(3, current + 1))}>
                Continuer
                <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button type="button" className="btn btn-primary">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Confirmer l enrolement
              </button>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[32px] border border-border bg-white p-6 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Recapitulatif</p>
            <div className="mt-5 space-y-4 text-sm">
              <div className="rounded-3xl bg-surface-alt p-4">
                <p className="text-muted-foreground">Localisation</p>
                <p className="mt-2 font-semibold text-foreground">
                  {form.region.replaceAll('_', ' ')} / {form.department.replaceAll('_', ' ')}
                </p>
                <p className="mt-1 text-foreground">{form.arrondissement}</p>
                <p className="mt-1 text-muted-foreground">{form.village || 'Village non renseigne'}</p>
              </div>

              <div className="rounded-3xl bg-surface-alt p-4">
                <p className="text-muted-foreground">Identifiant patient</p>
                <p className="mt-2 font-semibold text-foreground">{form.patientCode}</p>
              </div>

              <div className="rounded-3xl bg-surface-alt p-4">
                <p className="text-muted-foreground">Programme</p>
                <p className="mt-2 font-semibold text-foreground">{selectedProgram.label}</p>
                <p className="mt-1 text-muted-foreground">
                  {form.startDate} au {form.endDate}
                </p>
                <p className="mt-1 text-muted-foreground">{form.healthChequeWeeks} semaines</p>
              </div>

              <div className="rounded-3xl bg-surface-alt p-4">
                <p className="text-muted-foreground">Paiement</p>
                <p className="mt-2 font-semibold text-foreground">{form.amount} FCFA</p>
                <p className="mt-1 text-muted-foreground">{form.paymentMethod}</p>
                <p className="mt-1 text-muted-foreground">{form.receiptNumber || 'Recu non renseigne'}</p>
                <p className="mt-1 text-muted-foreground">{form.paymentDate}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-border bg-white p-6 shadow-soft">
            <p className="text-sm font-semibold text-foreground">Contexte CSU</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Les options proposees s appuient sur les cibles citees dans les publications officielles et para-officielles sur la CSU au Cameroun:
              femmes enceintes, enfants de 0 a 5 ans, personnes vivant avec le VIH, tuberculose et dialyse.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
