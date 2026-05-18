import { NextRequest } from "next/server";
import { callApiGet, callApiPost } from "@/lib/callApi";

export async function GET(request: NextRequest) {
  return callApiGet(request, "/courriers");
}

export async function POST(request: NextRequest) {
  const requiredFields = ["object"];
  return callApiPost(request, "/courriers", requiredFields);
}
