import { NextRequest } from "next/server";
import { callApiDelete } from "@/lib/callApi";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return callApiDelete(request, `/messages/${id}`);
}
