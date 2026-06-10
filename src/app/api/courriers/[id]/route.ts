import { NextRequest } from "next/server";
import { callApiGet, callApiPut } from "@/lib/callApi";

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


