// src/app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const tag = request.nextUrl.searchParams.get('tag');

    if (!tag) {
      return NextResponse.json({ message: 'Le paramètre "tag" est requis' }, { status: 400 });
    }

    revalidateTag(tag, 'max');

    return NextResponse.json({ revalidated: true, tag, now: Date.now() });
  } catch (error) {
    console.error('Erreur revalidation:', error);
    return NextResponse.json({ error: 'Erreur lors de la revalidation du cache' }, { status: 500 });
  }
}