import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  // Utilise la version d'API par défaut compatible avec stripe@20.4.0
});

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const priceId = searchParams.get('priceId') || process.env.STRIPE_PRICE_ID;

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID manquant' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Erreur checkout:', error);
    return NextResponse.json({ error: 'Erreur lors de la création de la session' }, { status: 500 });
  }
}
