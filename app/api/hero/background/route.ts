import { NextRequest, NextResponse } from 'next/server';

// Simuler une base de données simple pour stocker l'URL de l'arrière-plan
// En production, vous utiliserez une vraie base de données
let heroBackground: string = '';

// GET - Récupérer l'arrière-plan actuel
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        backgroundImage: heroBackground,
      },
    });
  } catch (error) {
    console.error('💥 Erreur récupération background:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération du background' },
      { status: 500 }
    );
  }
}

// POST - Mettre à jour l'arrière-plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { backgroundImage } = body;

    if (typeof backgroundImage !== 'string') {
      return NextResponse.json(
        { success: false, error: 'URL de background invalide' },
        { status: 400 }
      );
    }

    // Simuler la sauvegarde en base de données
    heroBackground = backgroundImage;
    
    console.log('🎨 Background Hero mis à jour:', backgroundImage);

    return NextResponse.json({
      success: true,
      data: {
        backgroundImage: heroBackground,
      },
    });
  } catch (error) {
    console.error('💥 Erreur mise à jour background:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour du background' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer l'arrière-plan
export async function DELETE() {
  try {
    heroBackground = '';
    console.log('🗑️ Background Hero supprimé');

    return NextResponse.json({
      success: true,
      message: 'Background supprimé avec succès',
    });
  } catch (error) {
    console.error('💥 Erreur suppression background:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression du background' },
      { status: 500 }
    );
  }
}
