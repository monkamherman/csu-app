'use client';

import { useState } from 'react';
import CloudinaryUpload from '../../components/CloudinaryUpload';
import { UploadResult } from '../../lib/cloudinary';

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadResult[]>([]);
  const [error, setError] = useState<string>('');

  const handleUploadSuccess = (result: UploadResult) => {
    setUploadedFiles((prev) => [...prev, result]);
    setError('');
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const getFileIcon = (resourceType: string) => {
    switch (resourceType) {
      case 'image':
        return '🖼️';
      case 'video':
        return '🎥';
      case 'raw':
        return '📄';
      default:
        return '📁';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Upload de fichiers Cloudinary</h1>
            <p className="mt-1 text-sm text-gray-500">Téléchargez vos images, vidéos et documents PDF</p>
          </div>

          <div className="p-6">
            {/* Zone d'upload */}
            <div className="mb-8">
              <CloudinaryUpload
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                folder="demo-uploads"
                className="w-full"
              />
            </div>

            {/* Messages d'erreur */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Liste des fichiers uploadés */}
            {uploadedFiles.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Fichiers uploadés ({uploadedFiles.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{getFileIcon(file.resource_type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.public_id.split('/').pop()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {file.format.toUpperCase()} • {formatFileSize(file.bytes)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(file.created_at).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>

                      {/* Aperçu pour les images */}
                      {file.resource_type === 'image' && (
                        <div className="mt-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={file.secure_url} alt="Aperçu" className="w-full h-32 object-cover rounded" />
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-3 flex space-x-2">
                        <a
                          href={file.secure_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Voir
                        </a>
                        <button
                          onClick={() => navigator.clipboard.writeText(file.secure_url)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Copier URL
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
