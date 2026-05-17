'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

import { useLocale } from '~/providers/LocaleProvider';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export default function PwaInstallButton() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const { dictionary } = useLocale();

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  if (installed) {
    return <div className="rounded-2xl bg-surface-alt px-4 py-3 text-sm font-semibold text-foreground">{dictionary.common.pwaInstalled}</div>;
  }

  if (!promptEvent) {
    return null;
  }

  const handleInstall = async () => {
    await promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
  };

  return (
    <button type="button" onClick={handleInstall} className="btn w-full justify-center">
      <Download className="mr-2 h-4 w-4" />
      {dictionary.common.installApp}
    </button>
  );
}
