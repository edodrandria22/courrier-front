import { NextRequest } from "next/server";
import { callApiPost } from "@/lib/callApi";

export async function POST(request: NextRequest) {
  const requiredFields = ["destId", "courrierId"];
  return callApiPost(request, "/messages", requiredFields, true);
}
