import { NextRequest, NextResponse } from 'next/server';
import { ImageService } from '../../../../lib/image-service';

// POST - Obtenir l'URL optimisée d'une image
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageId, options } = body;

    if (!imageId) {
      return NextResponse.json(
        { success: false, error: 'ID de l\'image requis' },
        { status: 400 }
      );
    }

    console.log('⚡ API: Optimisation image demandée:', imageId);

    const imageService = await ImageService.getInstance();
    const optimizedUrl = imageService.getOptimizedUrl(imageId, options || {});

    return NextResponse.json({
      success: true,
      data: {
        originalId: imageId,
        optimizedUrl,
        options,
      },
    });
  } catch (error) {
    console.error('💥 API Erreur optimisation image:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de l\'optimisation de l\'image',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
