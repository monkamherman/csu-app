'use client';
import axios from 'axios';
import { Activity, CheckCircle, Lock, Rocket } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);

  const handleBuyFunnel = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/checkout');
      window.location.href = res.data.url;
    } catch (err) {
      alert('Erreur lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            RAGE AI PLATFORM
          </h1>
          <p className="text-gray-400">Votre infrastructure digitale pilotée par IA</p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700">Support</button>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold">U</div>
        </div>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <div className="flex items-center gap-3 text-gray-400 mb-2">
            <Activity size={20} />
            <span>Revenus générés (IA)</span>
          </div>
          <p className="text-3xl font-bold">$0.00</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <div className="flex items-center gap-3 text-gray-400 mb-2">
            <Rocket size={20} />
            <span>Funnels Actifs</span>
          </div>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <div className="flex items-center gap-3 text-gray-400 mb-2">
            <CheckCircle size={20} />
            <span>Statut Abonnement</span>
          </div>
          <p className="text-3xl font-bold text-yellow-500">Inactif</p>
        </div>
      </div>

      {/* Services Section */}
      <h2 className="text-2xl font-bold mb-6">Nos Services IA</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Funnel AI Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-blue-900/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-600 text-xs px-2 py-1 rounded-bl">POPULAIRE</div>
          <h3 className="text-xl font-bold mb-2">Funnel AI System</h3>
          <p className="text-gray-400 text-sm mb-4">
            Tunnel de vente complet + Agent IA de qualification + Automatisation n8n.
          </p>
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="text-2xl font-bold">$3,000</span>
              <span className="text-gray-500 text-sm"> + $297/mois</span>
            </div>
          </div>
          <button
            onClick={handleBuyFunnel}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded font-bold transition disabled:opacity-50"
          >
            {loading ? 'Chargement...' : 'Activer le Funnel'}
          </button>
        </div>

        {/* Locked Card */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 opacity-60 relative">
          <div className="absolute top-6 right-6">
            <Lock size={20} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">Social AI Agent</h3>
          <p className="text-gray-400 text-sm mb-4">Création auto de contenu + Publication + Réponse commentaires.</p>
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="text-2xl font-bold">$497</span>
              <span className="text-gray-500 text-sm"> /mois</span>
            </div>
          </div>
          <button className="w-full py-3 bg-gray-700 rounded font-bold cursor-not-allowed">Bientôt disponible</button>
        </div>
      </div>
    </div>
  );
}
