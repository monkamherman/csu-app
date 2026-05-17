import { v2 as cloudinary } from 'cloudinary';
import { ImageCacheService } from './redis';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Types pour les images
export interface ImageData {
  id: string;
  public_id: string;
  secure_url: string;
  format: string;
  resource_type: 'image' | 'video' | 'raw';
  bytes: number;
  created_at: string;
  folder?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface UploadOptions {
  folder?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
  transformation?: any;
}

export interface UpdateOptions {
  tags?: string[];
  metadata?: Record<string, any>;
  transformation?: any;
}

// Service de gestion des images
export class ImageService {
  private static instance: ImageService;
  private cacheService: ImageCacheService;

  private constructor(cacheService: ImageCacheService) {
    this.cacheService = cacheService;
  }

  static async getInstance(): Promise<ImageService> {
    if (!ImageService.instance) {
      const cacheService = await ImageCacheService.getInstance();
      ImageService.instance = new ImageService(cacheService);
    }
    return ImageService.instance;
  }

  // Uploader une image
  async uploadImage(file: Buffer, filename: string, options: UploadOptions = {}): Promise<ImageData> {
    try {
      console.log('📤 Upload image:', filename);

      const uploadOptions: any = {
        folder: options.folder || 'uploads',
        resource_type: options.resource_type || 'auto',
        public_id: filename.replace(/\.[^/.]+$/, ''), // Enlever l'extension
        overwrite: false,
      };

      if (options.tags && options.tags.length > 0) {
        uploadOptions.tags = options.tags;
      }

      if (options.metadata) {
        uploadOptions.context = options.metadata;
      }

      if (options.transformation) {
        uploadOptions.transformation = options.transformation;
      }

      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          uploadOptions,
          async (error, result) => {
            if (error) {
              console.error('❌ Erreur upload:', error);
              reject(new Error(`Erreur upload: ${error.message}`));
              return;
            }

            if (!result) {
              reject(new Error('Résultat upload vide'));
              return;
            }

            const imageData: ImageData = {
              id: result.public_id,
              public_id: result.public_id,
              secure_url: result.secure_url,
              format: result.format || '',
              resource_type: result.resource_type as 'image' | 'video' | 'raw',
              bytes: result.bytes || 0,
              created_at: result.created_at || new Date().toISOString(),
              folder: result.folder,
              tags: result.tags || [],
              metadata: result.context || {},
            };

            // Mettre en cache
            await this.cacheService.cacheImage(imageData.id, imageData);

            console.log('✅ Upload réussi:', imageData.id);
            resolve(imageData);
          }
        ).end(file);
      });
    } catch (error) {
      console.error('💥 Erreur upload image:', error);
      throw error;
    }
  }

  // Récupérer une image par ID
  async getImage(imageId: string): Promise<ImageData | null> {
    try {
      // Vérifier d'abord le cache
      const cached = await this.cacheService.getCachedImage(imageId);
      if (cached) {
        console.log('📋 Image trouvée en cache:', imageId);
        return cached;
      }

      // Récupérer depuis Cloudinary
      const result = await cloudinary.api.resource(imageId);
      
      const imageData: ImageData = {
        id: result.public_id,
        public_id: result.public_id,
        secure_url: result.secure_url,
        format: result.format,
        resource_type: result.resource_type as 'image' | 'video' | 'raw',
        bytes: result.bytes,
        created_at: result.created_at,
        folder: result.folder,
        tags: result.tags || [],
        metadata: result.context || {},
      };

      // Mettre en cache
      await this.cacheService.cacheImage(imageId, imageData);

      console.log('🔍 Image récupérée:', imageId);
      return imageData;
    } catch (error: any) {
      if (error.message?.includes('No such resource')) {
        console.log('❌ Image non trouvée:', imageId);
        return null;
      }
      console.error('💥 Erreur récupération image:', error);
      throw error;
    }
  }

  // Lister les images
  async listImages(folder?: string, maxResults = 50): Promise<ImageData[]> {
    try {
      console.log('📋 Liste des images...');

      const options: any = {
        type: 'upload',
        max_results: maxResults,
        resource_type: 'image',
      };

      if (folder) {
        options.prefix = folder;
      }

      const result = await cloudinary.api.resources(options);
      
      const images: ImageData[] = result.resources.map((resource: any) => ({
        id: resource.public_id,
        public_id: resource.public_id,
        secure_url: resource.secure_url,
        format: resource.format,
        resource_type: resource.resource_type,
        bytes: resource.bytes,
        created_at: resource.created_at,
        folder: resource.folder,
        tags: resource.tags || [],
        metadata: resource.context || {},
      }));

      // Mettre en cache toutes les images
      for (const image of images) {
        await this.cacheService.cacheImage(image.id, image);
      }

      console.log(`📋 ${images.length} images trouvées`);
      return images;
    } catch (error) {
      console.error('💥 Erreur liste images:', error);
      throw error;
    }
  }

  // Mettre à jour une image
  async updateImage(imageId: string, options: UpdateOptions): Promise<ImageData> {
    try {
      console.log('🔄 Mise à jour image:', imageId);

      const updateOptions: any = {};

      if (options.tags) {
        updateOptions.tags = options.tags;
      }

      if (options.metadata) {
        updateOptions.context = options.metadata;
      }

      if (options.transformation) {
        updateOptions.transformation = options.transformation;
      }

      const result = await cloudinary.api.update(imageId, updateOptions);

      const imageData: ImageData = {
        id: result.public_id,
        public_id: result.public_id,
        secure_url: result.secure_url,
        format: result.format,
        resource_type: result.resource_type as 'image' | 'video' | 'raw',
        bytes: result.bytes,
        created_at: result.created_at,
        folder: result.folder,
        tags: result.tags || [],
        metadata: result.context || {},
      };

      // Mettre à jour le cache
      await this.cacheService.cacheImage(imageId, imageData);

      console.log('✅ Image mise à jour:', imageId);
      return imageData;
    } catch (error) {
      console.error('💥 Erreur mise à jour image:', error);
      throw error;
    }
  }

  // Supprimer une image
  async deleteImage(imageId: string): Promise<boolean> {
    try {
      console.log('🗑️ Suppression image:', imageId);

      await cloudinary.api.delete_resources([imageId]);
      
      // Supprimer du cache
      await this.cacheService.removeCachedImage(imageId);

      console.log('✅ Image supprimée:', imageId);
      return true;
    } catch (error) {
      console.error('💥 Erreur suppression image:', error);
      throw error;
    }
  }

  // Obtenir l'URL optimisée d'une image
  getOptimizedUrl(imageId: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
    crop?: string;
  } = {}): string {
    const transformation = cloudinary.url(imageId, {
      width: options.width,
      height: options.height,
      quality: options.quality || 'auto',
      format: options.format || 'auto',
      crop: options.crop || 'limit',
      secure: true,
    });

    return transformation;
  }
}
