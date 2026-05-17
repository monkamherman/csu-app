import { createClient, RedisClientType } from 'redis';

// Client Redis pour le cache
let redisClient: RedisClientType;

// Initialisation du client Redis
export async function initRedis(): Promise<RedisClientType> {
  if (redisClient) {
    return redisClient;
  }

  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        connectTimeout: 5000,
      },
    });

    redisClient.on('error', (err) => {
      console.error('❌ Erreur Redis:', err);
    });

    redisClient.on('connect', () => {
      console.log('✅ Connecté à Redis');
    });

    redisClient.on('ready', () => {
      console.log('🚀 Redis prêt');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('💥 Erreur connexion Redis:', error);
    throw error;
  }
}

// Obtenir le client Redis
export function getRedisClient(): RedisClientType {
  if (!redisClient) {
    throw new Error("Redis non initialisé. Appelez initRedis() d'abord.");
  }
  return redisClient;
}

// Service de cache pour les images
export class ImageCacheService {
  private static instance: ImageCacheService;
  private redis: RedisClientType;

  private constructor(redis: RedisClientType) {
    this.redis = redis;
  }

  static async getInstance(): Promise<ImageCacheService> {
    if (!ImageCacheService.instance) {
      const redis = await initRedis();
      ImageCacheService.instance = new ImageCacheService(redis);
    }
    return ImageCacheService.instance;
  }

  // Mettre en cache les informations d'une image
  async cacheImage(imageId: string, imageData: any): Promise<void> {
    try {
      const key = `image:${imageId}`;
      await this.redis.setEx(key, 3600, JSON.stringify(imageData)); // 1 heure
      console.log(`📷 Image ${imageId} mise en cache`);
    } catch (error) {
      console.error('❌ Erreur cache image:', error);
    }
  }

  // Récupérer une image depuis le cache
  async getCachedImage(imageId: string): Promise<any | null> {
    try {
      const key = `image:${imageId}`;
      const cached = await this.redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('❌ Erreur récupération cache:', error);
      return null;
    }
  }

  // Supprimer une image du cache
  async removeCachedImage(imageId: string): Promise<void> {
    try {
      const key = `image:${imageId}`;
      await this.redis.del(key);
      console.log(`🗑️ Image ${imageId} supprimée du cache`);
    } catch (error) {
      console.error('❌ Erreur suppression cache:', error);
    }
  }

  // Lister toutes les images en cache
  async listCachedImages(): Promise<string[]> {
    try {
      const keys = await this.redis.keys('image:*');
      return keys.map((key) => key.replace('image:', ''));
    } catch (error) {
      console.error('❌ Erreur liste cache:', error);
      return [];
    }
  }

  // Vider tout le cache des images
  async clearImageCache(): Promise<void> {
    try {
      const keys = await this.redis.keys('image:*');
      if (keys.length > 0) {
        await this.redis.del(keys);
        console.log(`🧹 ${keys.length} images supprimées du cache`);
      }
    } catch (error) {
      console.error('❌ Erreur vidage cache:', error);
    }
  }
}
