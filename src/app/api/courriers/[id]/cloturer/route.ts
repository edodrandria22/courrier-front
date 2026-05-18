import { callApiPost } from '@/lib/callApi'
import { NextRequest } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return callApiPost(request, `/courriers/${id}/cloturer`, [], false)
}
