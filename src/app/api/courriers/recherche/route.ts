import { NextRequest } from "next/server";
import { callApiPost } from "@/lib/callApi";


export async function POST(request: NextRequest) {
  const requiredFields: string[] = [];
  const allowedParams: string[] = ["page", "limit"];
  return callApiPost(request, "/courriers/recherche", requiredFields, false, allowedParams);
}
