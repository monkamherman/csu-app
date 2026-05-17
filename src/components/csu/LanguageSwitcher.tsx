'use client';

import { useLocale } from '~/providers/LocaleProvider';

const locales = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
] as const;

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-white/70 p-1 shadow-soft backdrop-blur">
      {locales.map((item) => (
        <button
          key={item.code}
          type="button"
          onClick={() => setLocale(item.code)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            locale === item.code ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
