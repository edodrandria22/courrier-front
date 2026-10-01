import { NextRequest } from "next/server";
import { callApiGet, callApiPost} from "@/lib/callApi";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return callApiGet(request, `/courriersValidations/${id}`);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return callApiPost(request, `/courriersValidations/${id}`,[],true);
}


