import { getServerAxios } from '@/lib/getServerAxios'
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const api = getServerAxios(request)
    const response = await api.get(`/fichiers/${id}/download`, {
      responseType: 'arraybuffer',
    })

    const contentType = response.headers['content-type'] ?? 'application/octet-stream'
    const contentDisposition = response.headers['content-disposition'] ?? ''

    return new NextResponse(response.data as ArrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
      },
    })
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 500
      const msg = err.response?.data?.message ?? 'Fichier introuvable.'
      return NextResponse.json({ error: msg }, { status })
    }
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
