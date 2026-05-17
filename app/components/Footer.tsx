import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-12 bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4">RAGE AI</h4>
            <p className="text-gray-400 text-sm">Infrastructure Digitale Pilotée par IA</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="#modules" className="hover:text-white">
                  Funnel AI
                </Link>
              </li>
              <li>
                <Link href="#modules" className="hover:text-white">
                  Automation
                </Link>
              </li>
              <li>
                <Link href="#modules" className="hover:text-white">
                  Content AI
                </Link>
              </li>
              <li>
                <Link href="#modules" className="hover:text-white">
                  Social AI
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>WhatsApp: +237 658 85 27 31</li>
              <li>Email: contact@rageai.tech</li>
              <li>Cameroun</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Réseaux</h4>
            <div className="flex gap-4">
              <a href="https://tiktok.com/@rage_ai" className="text-gray-400 hover:text-white">
                TikTok
              </a>
              <a href="https://facebook.com/rageatech" className="text-gray-400 hover:text-white">
                Facebook
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          © 2025 RAGE AI. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
