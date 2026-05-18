import { NextRequest } from "next/server";
import { callApiPatch } from "@/lib/callApi";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return callApiPatch(request, `/messages/${id}/non-lu`);
}
