import { NextRequest } from "next/server";
import { callApiDelete, callApiGet, callApiPut } from "@/lib/callApi";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return callApiGet(request, `/courriers/${id}`);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return callApiPut(request, `/courriers/${id}`);
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return callApiDelete(request, `/courriers/${id}`);
}



