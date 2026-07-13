import { NextRequest } from "next/server";
import { callApiGet } from "@/lib/callApi";

export async function GET(request: NextRequest) {
  const requiredFields = ["dateDebut","dateFin"];
  return callApiGet(request, "/courriers/statistique", requiredFields);
}


