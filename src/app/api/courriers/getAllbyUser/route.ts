import { NextRequest } from "next/server";
import { callApiGet } from "@/lib/callApi";

export async function GET(request: NextRequest) {
  const allowed = ["date","isTraiterAt","limit","isRecu"];
  return callApiGet(request, "/courriers/getAllbyUser", allowed);
}
