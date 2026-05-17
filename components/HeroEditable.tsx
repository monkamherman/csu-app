'use client';

import { ArrowRight, Edit2, Upload, X, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { ImageData } from '../lib/image-service';
import ImageUploader from './ImageUploader';

interface HeroEditableProps {
  isAdmin?: boolean;
  backgroundImage?: string;
  onBackgroundChange?: (imageUrl: string) => void;
}

export default function HeroEditable({ isAdmin = false, backgroundImage, onBackgroundChange }: HeroEditableProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (imageData: ImageData) => {
    setIsUploading(true);
    try {
      // Appeler l'API d'optimisation pour obtenir une URL optimisée
      const optimizeResponse = await fetch('/api/images/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageId: imageData.id,
          options: {
            width: 1920,
            height: 1080,
            quality: 80,
            format: 'auto',
            crop: 'fill',
          },
        }),
      });

      const optimizeResult = await optimizeResponse.json();

      if (optimizeResult.success) {
        const optimizedUrl = optimizeResult.data.optimizedUrl;
        onBackgroundChange?.(optimizedUrl);
        setShowUploadModal(false);
      }
    } catch (error) {
      console.error("Erreur lors de l'optimisation de l'image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <section className="relative overflow-hidden">
        {/* Background avec image ou dégradé par défaut */}
        {backgroundImage ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/80 to-gray-950/90"></div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-950"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]"></div>
          </>
        )}

        {/* Bouton d'administration */}
        {isAdmin && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="absolute top-4 right-4 z-20 px-4 py-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-colors flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Modifier l&apos;arrière-plan
          </button>
        )}

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

      {/* Modal d'upload */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  <Upload className="w-6 h-6 inline mr-2" />
                  Modifier l&apos;arrière-plan de la Hero
                </h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {isUploading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-300">Optimisation de l&apos;image en cours...</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <p className="text-gray-300 mb-4">
                      Choisissez une image pour l&apos;arrière-plan. L&apos;image sera optimisée automatiquement pour le
                      web.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                      <div className="bg-gray-800 p-3 rounded-lg">
                        <span className="text-blue-400">✓</span> Formats: JPG, PNG, WebP
                      </div>
                      <div className="bg-gray-800 p-3 rounded-lg">
                        <span className="text-blue-400">✓</span> Taille max: 50MB
                      </div>
                      <div className="bg-gray-800 p-3 rounded-lg">
                        <span className="text-blue-400">✓</span> Optimisation auto
                      </div>
                      <div className="bg-gray-800 p-3 rounded-lg">
                        <span className="text-blue-400">✓</span> Cache Redis
                      </div>
                    </div>
                  </div>

                  <ImageUploader
                    onUploadSuccess={handleImageUpload}
                    onUploadError={(error) => {
                      console.error('Erreur upload:', error);
                      alert("Erreur lors de l'upload: " + error);
                    }}
                    folder="hero-backgrounds"
                    tags={['hero', 'background']}
                    metadata={{ section: 'hero', type: 'background' }}
                    className="w-full"
                  />

                  {backgroundImage && (
                    <div className="mt-6">
                      <p className="text-gray-300 mb-3">Image actuelle:</p>
                      <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={backgroundImage}
                          alt="Arrière-plan actuel"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => onBackgroundChange?.('')}
                          className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
