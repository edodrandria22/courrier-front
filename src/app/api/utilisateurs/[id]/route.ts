import { NextRequest } from "next/server";
import { callApiGet, callApiPut, callApiDelete } from "@/lib/callApi";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return callApiGet(request, `/utilisateurs/${id}`);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const requiredFields = ["email", "nom", "adresse", "idRole"];
  return callApiPut(request, `utilisateurs/${id}`, requiredFields);
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return callApiDelete(request, `utilisateurs/${id}`);
}

