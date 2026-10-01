import { NextRequest } from "next/server";
import { callApiGet, callApiPost } from "@/lib/callApi";

export async function GET(request: NextRequest) {
  return callApiGet(request, "/courriersValidations",["date","limit","isValid"]);
}

export async function POST(request: NextRequest) {
  const requiredFields = ["object","ville","dateDebut","dateFin"];
  return callApiPost(request, "/courriersValidations", requiredFields, true);
}
