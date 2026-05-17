'use client';

import React, { useState, useCallback } from 'react';
import { ImageData } from '../lib/image-service';

interface ImageUploaderProps {
  onUploadSuccess?: (imageData: ImageData) => void;
  onUploadError?: (error: string) => void;
  folder?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  className?: string;
  disabled?: boolean;
}

export default function ImageUploader({
  onUploadSuccess,
  onUploadError,
  folder = 'uploads',
  tags = [],
  metadata = {},
  className = '',
  disabled = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = useCallback(
    async (files: FileList) => {
      if (disabled) return;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validation du type de fichier
        const validTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
          'video/mp4',
          'video/avi',
          'video/mov',
          'video/wmv',
          'application/pdf',
        ];

        if (!validTypes.includes(file.type) && !file.type.startsWith('image/') && !file.type.startsWith('video/')) {
          onUploadError?.(`Type de fichier non supporté: ${file.type}`);
          continue;
        }

        // Validation de la taille (50MB max)
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
          onUploadError?.(`Fichier trop volumineux: ${file.name} (max 50MB)`);
          continue;
        }

        setUploading(true);
        setProgress(0);

        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('folder', folder);
          if (tags.length > 0) {
            formData.append('tags', tags.join(','));
          }
          if (Object.keys(metadata).length > 0) {
            formData.append('metadata', JSON.stringify(metadata));
          }

          // Simulation de progression
          const progressInterval = setInterval(() => {
            setProgress((prev) => Math.min(prev + 10, 90));
          }, 200);

          const response = await fetch('/api/images', {
            method: 'POST',
            body: formData,
          });

          clearInterval(progressInterval);
          setProgress(100);

          const result = await response.json();

          if (response.ok && result.success) {
            onUploadSuccess?.(result.data);
          } else {
            onUploadError?.(result.error || "Erreur lors de l'upload");
          }
        } catch (error) {
          onUploadError?.("Erreur réseau lors de l'upload");
        } finally {
          setUploading(false);
          setProgress(0);
        }
      }
    },
    [folder, tags, metadata, disabled, onUploadSuccess, onUploadError],
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleUpload(e.dataTransfer.files);
      }
    },
    [handleUpload],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleUpload(e.target.files);
      }
    },
    [handleUpload],
  );

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${disabled ? 'opacity-30 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*,video/*,.pdf"
          multiple={true}
          onChange={handleChange}
          disabled={disabled || uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="pointer-events-none">
          {uploading ? (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600">Upload en cours...</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-gray-400">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">Glissez-déposez vos fichiers ici</p>
                <p className="text-sm text-gray-500">ou cliquez pour sélectionner</p>
              </div>
              <p className="text-xs text-gray-400">
                Images (JPG, PNG, GIF, WebP), Vidéos (MP4, AVI, MOV), PDF - Max 50MB
              </p>
              {tags.length > 0 && <p className="text-xs text-blue-600">Tags: {tags.join(', ')}</p>}
              {folder && <p className="text-xs text-green-600">Dossier: {folder}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
