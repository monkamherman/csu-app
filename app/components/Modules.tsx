import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

interface Module {
  icon: JSX.Element;
  title: string;
  description: string;
  price: string;
  popular: boolean;
  features: string[];
}

interface ModulesProps {
  modules: Module[];
}

export default function Modules({ modules }: ModulesProps) {
  return (
    <section id="modules" className="py-20 bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Nos 8 Modules AI</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Chaque service transformé en solution productisée. Choisissez vos modules, 
            nous livrons en 7 jours maximum.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module, index) => (
            <div 
              key={index}
              className={`relative bg-gray-800/50 border rounded-xl p-6 hover:border-blue-500/50 transition group ${
                module.popular ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-700'
              }`}
            >
              {module.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-xs px-3 py-1 rounded-full font-bold">
                  POPULAIRE
                </div>
              )}
              
              <div className="text-blue-400 mb-4 group-hover:text-blue-300 transition">
                {module.icon}
              </div>
              
              <h3 className="text-xl font-bold mb-2">{module.title}</h3>
              <p className="text-gray-400 text-sm mb-4 h-10">{module.description}</p>
              
              <div className="mb-4">
                <p className="text-2xl font-bold text-white">{module.price}</p>
              </div>
              
              <ul className="space-y-2 mb-6">
                {module.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link 
                href="/dashboard"
                className={`w-full py-3 rounded-lg font-bold text-center transition ${
                  module.popular 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                Activer ce Module
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
