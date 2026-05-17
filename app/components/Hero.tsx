import { ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-950"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-24">
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Zap className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              RAGE AI
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
            Infrastructure Digitale Complète Pilotée par IA
          </p>

          <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
            Transformez votre business avec nos 8 modules AI. De la stratégie à l automatisation, nous construisons
            votre écosystème digital scalable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition flex items-center justify-center gap-2"
            >
              Commencer Maintenant <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#modules"
              className="px-8 py-4 bg-gray-800 border border-gray-700 rounded-lg font-bold text-lg hover:bg-gray-700 transition"
            >
              Voir les Modules
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div>
              <p className="text-3xl font-bold text-blue-400">8</p>
              <p className="text-gray-400 text-sm">Modules AI</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-400">90%</p>
              <p className="text-gray-400 text-sm">Automatisation</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-pink-400">24/7</p>
              <p className="text-gray-400 text-sm">Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
