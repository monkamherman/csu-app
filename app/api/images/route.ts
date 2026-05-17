import { NextRequest, NextResponse } from 'next/server';
import { ImageService } from '../../../lib/image-service';

// GET - Lister les images
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || undefined;
    const maxResults = parseInt(searchParams.get('limit') || '50');

    console.log('📋 API: Liste des images demandée');

    const imageService = await ImageService.getInstance();
    const images = await imageService.listImages(folder, maxResults);

    return NextResponse.json({
      success: true,
      data: images,
      count: images.length,
    });
  } catch (error) {
    console.error('💥 API Erreur liste images:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des images',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 },
    );
  }
}

// POST - Uploader une image
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'uploads';
    const tags = (formData.get('tags') as string) ? (formData.get('tags') as string).split(',') : [];
    const metadata = (formData.get('metadata') as string) ? JSON.parse(formData.get('metadata') as string) : {};

    if (!file) {
      return NextResponse.json({ success: false, error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Validation du fichier
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: 'Fichier trop volumineux (max 50MB)' }, { status: 400 });
    }

    // Validation du type
    const allowedTypes = ['image/', 'video/', 'application/pdf'];
    const isAllowed = allowedTypes.some((type) => file.type.startsWith(type));
    if (!isAllowed) {
      return NextResponse.json({ success: false, error: 'Type de fichier non supporté' }, { status: 400 });
    }

    console.log('📤 API: Upload image demandé');

    const buffer = Buffer.from(await file.arrayBuffer());
    const imageService = await ImageService.getInstance();

    const imageData = await imageService.uploadImage(buffer, file.name, {
      folder,
      tags,
      metadata,
    });

    return NextResponse.json({
      success: true,
      data: imageData,
    });
  } catch (error) {
    console.error('💥 API Erreur upload image:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de l'upload",
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 },
    );
  }
}
