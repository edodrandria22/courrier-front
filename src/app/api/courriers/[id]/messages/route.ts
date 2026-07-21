import { NextRequest } from "next/server";
import { callApiGet } from "@/lib/callApi";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const allowed = ["date","limit"];
  return callApiGet(request, `/courriers/${id}/messages`, allowed);
}
