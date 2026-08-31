import { NextRequest } from "next/server";
import { callApiPost } from "@/lib/callApi";

export async function POST(request: NextRequest) {
  const requiredFields = ["destId", "id","numeroDepart"];
  return callApiPost(request, "/messages/transferer", requiredFields, true);
}
