import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';
import { UploadResult } from '../../../lib/cloudinary';

// Configuration Cloudinary côté serveur
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: NextRequest) {
  console.log('🚀 Upload API appelée');

  try {
    const formData = await request.formData();
    console.log('📋 FormData reçu');

    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'uploads';
    const resourceType = (formData.get('resourceType') as 'image' | 'video' | 'raw' | 'auto') || 'auto';

    console.log('📁 Infos fichier:', {
      name: file?.name,
      size: file?.size,
      type: file?.type,
      folder,
      resourceType,
    });

    if (!file) {
      console.log('❌ Aucun fichier fourni');
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Vérification de la taille du fichier (50MB max)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      console.log('❌ Fichier trop volumineux:', file.size);
      return NextResponse.json({ error: 'Fichier trop volumineux (max 50MB)' }, { status: 400 });
    }

    // Conversion du fichier en buffer
    console.log('🔄 Conversion du fichier en buffer...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('✅ Buffer créé, taille:', buffer.length);

    // Détermination du type de ressource
    let detectedResourceType: 'image' | 'video' | 'raw' = 'raw';

    if (file.type.startsWith('image/')) {
      detectedResourceType = 'image';
    } else if (file.type.startsWith('video/')) {
      detectedResourceType = 'video';
    } else if (file.type === 'application/pdf') {
      detectedResourceType = 'raw';
    }

    console.log('🔍 Type détecté:', detectedResourceType);

    // Options d'upload
    const finalResourceType = resourceType === 'auto' ? detectedResourceType : resourceType;

    const uploadOptions: any = {
      folder,
      resource_type: finalResourceType,
    };

    console.log('⚙️ Options upload:', uploadOptions);
    console.log('🔧 Config Cloudinary:', {
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? '✅' : '❌',
      api_key: process.env.CLOUDINARY_API_KEY ? '✅' : '❌',
      api_secret: process.env.CLOUDINARY_API_SECRET ? '✅' : '❌',
    });

    // Upload vers Cloudinary
    console.log('☁️ Début upload vers Cloudinary...');

    return new Promise<NextResponse>((resolve) => {
      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          console.log('📨 Réponse Cloudinary reçue');

          if (error) {
            console.error('❌ Erreur upload Cloudinary:', error);
            resolve(NextResponse.json({ error: "Erreur lors de l'upload", details: error.message }, { status: 500 }));
          } else {
            console.log('✅ Upload réussi:', result);
            const uploadResult: UploadResult = {
              secure_url: result?.secure_url || '',
              public_id: result?.public_id || '',
              format: result?.format || '',
              resource_type: result?.resource_type as 'image' | 'video' | 'raw',
              bytes: result?.bytes || 0,
              created_at: result?.created_at || '',
            };
            resolve(NextResponse.json({ success: true, result: uploadResult }));
          }
        })
        .on('error', (error) => {
          console.error('❌ Erreur stream Cloudinary:', error);
          resolve(NextResponse.json({ error: 'Erreur stream', details: error.message }, { status: 500 }));
        })
        .end(buffer);
    });
  } catch (error) {
    console.error('💥 Erreur générale upload:', error);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'upload", details: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 },
    );
  }
}
