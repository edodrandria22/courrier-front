import { NextRequest } from "next/server";
import { callApiPost } from "@/lib/callApi";


export async function POST(request: NextRequest) {
  const requiredFields: string[] = [];
  return callApiPost(request, "/courriers/recherche", requiredFields);
}
