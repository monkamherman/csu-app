'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import ImageUploader from '../../../components/ImageUploader';
import { ImageData } from '../../../lib/image-service';

export default function ImageDashboard() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [editingImage, setEditingImage] = useState<ImageData | null>(null);
  const [replacingImage, setReplacingImage] = useState<ImageData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Charger les images
  const loadImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/images');
      const result = await response.json();

      if (result.success) {
        setImages(result.data);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Erreur lors du chargement des images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  // Upload réussi
  const handleUploadSuccess = (imageData: ImageData) => {
    setImages((prev) => [imageData, ...prev]);
    setError('');
  };

  // Remplacer une image
  const handleReplace = async (imageToReplace: ImageData) => {
    setReplacingImage(imageToReplace);
    setSelectedImage(null);
  };

  // Erreur upload
  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
  };

  // Supprimer une image
  const handleDelete = async (imageId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setImages((prev) => prev.filter((img) => img.id !== imageId));
        setSelectedImage(null);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Erreur lors de la suppression');
    }
  };

  // Mettre à jour une image
  const handleUpdate = async (imageData: ImageData) => {
    try {
      const response = await fetch(`/api/images/${imageData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tags: imageData.tags,
          metadata: imageData.metadata,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setImages((prev) => prev.map((img) => (img.id === imageData.id ? result.data : img)));
        setEditingImage(null);
        setSelectedImage(result.data);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Erreur lors de la mise à jour');
    }
  };

  // Filtrer les images
  const filteredImages = images.filter((image) => {
    const matchesSearch =
      image.public_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filter === 'all') return matchesSearch;
    return matchesSearch && image.resource_type === filter;
  });

  // Formater la taille du fichier
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Images</h1>
          <p className="mt-2 text-gray-600">Upload, organisez et gérez vos médias</p>
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

        {/* Zone d'upload */}
        <div className="mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Nouvel Upload</h2>
            <ImageUploader
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              folder="dashboard-uploads"
              tags={['dashboard']}
            />
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="mb-6 bg-white shadow rounded-lg p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher une image..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous</option>
                <option value="image">Images</option>
                <option value="video">Vidéos</option>
                <option value="raw">Documents</option>
              </select>
              <button
                onClick={loadImages}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Actualiser
              </button>
            </div>
          </div>
        </div>

        {/* Grille d'images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des images...</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">Aucune image trouvée</p>
            </div>
          ) : (
            filteredImages.map((image) => (
              <div
                key={image.id}
                className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Aperçu */}
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  {image.resource_type === 'image' ? (
                    <Image
                      src={image.secure_url}
                      alt={image.public_id}
                      width={320}
                      height={192}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">{image.resource_type === 'video' ? '🎥' : '📄'}</div>
                        <p className="text-sm text-gray-600">{image.resource_type}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Informations */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 truncate">{image.public_id.split('/').pop()}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatFileSize(image.bytes)} • {image.format?.toUpperCase()}
                  </p>

                  {/* Tags */}
                  {image.tags && image.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {image.tags.map((tag, index) => (
                        <span key={index} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setSelectedImage(image)}
                      className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Voir
                    </button>
                    <button
                      onClick={() => setEditingImage(image)}
                      className="flex-1 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleReplace(image)}
                      className="flex-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                    >
                      Remplacer
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal de visualisation */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold">{selectedImage.public_id}</h2>
                  <button onClick={() => setSelectedImage(null)} className="text-gray-500 hover:text-gray-700">
                    ✕
                  </button>
                </div>

                {selectedImage.resource_type === 'image' ? (
                  <Image
                    src={selectedImage.secure_url}
                    alt={selectedImage.public_id}
                    width={800}
                    height={600}
                    className="w-full max-h-96 object-contain mb-4"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center bg-gray-100 mb-4">
                    <div className="text-center">
                      <div className="text-6xl mb-4">{selectedImage.resource_type === 'video' ? '🎥' : '📄'}</div>
                      <a
                        href={selectedImage.secure_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Ouvrir le fichier
                      </a>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">ID:</span> {selectedImage.id}
                  </div>
                  <div>
                    <span className="font-medium">Taille:</span> {formatFileSize(selectedImage.bytes)}
                  </div>
                  <div>
                    <span className="font-medium">Format:</span> {selectedImage.format?.toUpperCase()}
                  </div>
                  <div>
                    <span className="font-medium">Type:</span> {selectedImage.resource_type}
                  </div>
                  <div>
                    <span className="font-medium">Créé le:</span>{' '}
                    {new Date(selectedImage.created_at).toLocaleDateString('fr-FR')}
                  </div>
                  <div>
                    <span className="font-medium">Dossier:</span> {selectedImage.folder || 'Racine'}
                  </div>
                </div>

                <div className="mt-4">
                  <a
                    href={selectedImage.secure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Voir sur Cloudinary
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal d'édition */}
        {editingImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Modifier l&apos;image</h2>
                  <button onClick={() => setEditingImage(null)} className="text-gray-500 hover:text-gray-700">
                    ✕
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdate(editingImage);
                  }}
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (séparés par des virgules)
                    </label>
                    <input
                      type="text"
                      value={editingImage.tags?.join(', ') || ''}
                      onChange={(e) =>
                        setEditingImage({
                          ...editingImage,
                          tags: e.target.value
                            .split(',')
                            .map((tag) => tag.trim())
                            .filter(Boolean),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Métadonnées (JSON)</label>
                    <textarea
                      value={JSON.stringify(editingImage.metadata || {}, null, 2)}
                      onChange={(e) => {
                        try {
                          const metadata = JSON.parse(e.target.value);
                          setEditingImage({ ...editingImage, metadata });
                        } catch (error) {
                          // Ignorer les erreurs de JSON
                        }
                      }}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Enregistrer
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingImage(null)}
                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal de remplacement */}
        {replacingImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Remplacer l&apos;image</h2>
                  <button onClick={() => setReplacingImage(null)} className="text-gray-500 hover:text-gray-700">
                    ✕
                  </button>
                </div>

                <div className="mb-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center mb-2">
                      <div className="text-yellow-600 mr-2">⚠️</div>
                      <p className="text-sm font-medium text-yellow-800">
                        L&apos;ancienne image sera automatiquement supprimée de Cloudinary et de la base de données
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">Choisissez la nouvelle image qui remplacera l&apos;actuelle :</p>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-4xl mb-4">🖼️</div>
                      <p className="text-sm text-gray-600">Image à remplacer</p>
                      <p className="font-medium">{replacingImage.public_id.split('/').pop()}</p>
                    </div>
                  </div>
                </div>

                <ImageUploader
                  onUploadSuccess={async (newImageData) => {
                    try {
                      // Supprimer l'ancienne image de Cloudinary et de la base de données
                      const deleteResponse = await fetch(`/api/images/${replacingImage.id}`, {
                        method: 'DELETE',
                      });

                      const deleteResult = await deleteResponse.json();

                      if (!deleteResult.success) {
                        console.error('Erreur suppression ancienne image:', deleteResult.error);
                        alert("Erreur lors de la suppression de l'ancienne image: " + deleteResult.error);
                        return;
                      }

                      // Remplacer l'image dans la liste
                      setImages((prev) =>
                        prev.map((img) =>
                          img.id === replacingImage.id ? { ...newImageData, id: replacingImage.id } : img,
                        ),
                      );

                      // Mettre à jour l'image sélectionnée
                      setSelectedImage({ ...newImageData, id: replacingImage.id });
                      setReplacingImage(null);

                      console.log('✅ Image remplacée avec succès');
                    } catch (error) {
                      console.error('Erreur lors du remplacement:', error);
                      alert('Erreur lors du remplacement: ' + error);
                    }
                  }}
                  onUploadError={(error) => {
                    console.error('Erreur upload:', error);
                    alert("Erreur lors de l'upload: " + error);
                  }}
                  folder="dashboard-replacements"
                  tags={['replacement', 'dashboard']}
                  metadata={{ replacedImageId: replacingImage.id }}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
