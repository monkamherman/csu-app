import { v2 as cloudinary } from 'cloudinary';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

// Types pour les uploads
export interface UploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: 'image' | 'video' | 'raw';
  bytes: number;
  created_at: string;
}

export interface UploadOptions {
  folder?: string;
  resource_type?: 'image' | 'video' | 'raw';
  allowed_formats?: string[];
  max_file_size?: number;
  transformation?: any;
}
