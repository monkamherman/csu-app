import { NextRequest, NextResponse } from 'next/server';
import { ImageService } from '../../../../lib/image-service';

// GET - Récupérer une image spécifique
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const imageId = params.id;
    console.log('🔍 API: Récupération image demandée:', imageId);

    const imageService = await ImageService.getInstance();
    const image = await imageService.getImage(imageId);

    if (!image) {
      return NextResponse.json({ success: false, error: 'Image non trouvée' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error('💥 API Erreur récupération image:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération de l'image",
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 },
    );
  }
}

// PUT - Mettre à jour une image
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const imageId = params.id;
    const body = await request.json();

    console.log('🔄 API: Mise à jour image demandée:', imageId);

    const imageService = await ImageService.getInstance();
    const updatedImage = await imageService.updateImage(imageId, {
      tags: body.tags,
      metadata: body.metadata,
      transformation: body.transformation,
    });

    return NextResponse.json({
      success: true,
      data: updatedImage,
    });
  } catch (error) {
    console.error('💥 API Erreur mise à jour image:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la mise à jour de l'image",
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 },
    );
  }
}

// DELETE - Supprimer une image
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const imageId = params.id;
    console.log('🗑️ API: Suppression image demandée:', imageId);

    const imageService = await ImageService.getInstance();
    await imageService.deleteImage(imageId);

    return NextResponse.json({
      success: true,
      message: 'Image supprimée avec succès',
    });
  } catch (error) {
    console.error('💥 API Erreur suppression image:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la suppression de l'image",
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 },
    );
  }
}
