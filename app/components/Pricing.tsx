import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function Pricing() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Packages B2B</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Des tarifs adaptés à votre taille. Commencez petit, scalez quand vous êtes prêt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-2">Starter</h3>
            <p className="text-gray-400 text-sm mb-6">TPE / Indépendants</p>
            <p className="text-4xl font-bold mb-6">
              $997<span className="text-lg text-gray-400">/mois</span>
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-500" />1 module au choix
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-500" />
                5h support / mois
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Accès dashboard
              </li>
            </ul>
            <Link
              href="/dashboard"
              className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold text-center transition block"
            >
              Choisir Starter
            </Link>
          </div>

          {/* Growth */}
          <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-500 rounded-xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-xs px-3 py-1 rounded-full font-bold">
              RECOMMANDÉ
            </div>
            <h3 className="text-2xl font-bold mb-2">Growth</h3>
            <p className="text-gray-400 text-sm mb-6">PME (5-50 salariés)</p>
            <p className="text-4xl font-bold mb-6">
              $2,497<span className="text-lg text-gray-400">/mois</span>
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-500" />3 modules au choix
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-500" />
                15h support / mois
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Support prioritaire
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Accès API
              </li>
            </ul>
            <Link
              href="/dashboard"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-center transition block"
            >
              Choisir Growth
            </Link>
          </div>

          {/* Scale */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-2">Scale</h3>
            <p className="text-gray-400 text-sm mb-6">ETI / Startups</p>
            <p className="text-4xl font-bold mb-6">
              $5,997<span className="text-lg text-gray-400">/mois</span>
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Tous les modules
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Setup custom
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Support 24/7
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-500" />
                SLA garanti
              </li>
            </ul>
            <Link
              href="/dashboard"
              className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold text-center transition block"
            >
              Choisir Scale
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
