import { NextRequest } from "next/server";
import {  callApiPost } from "@/lib/callApi";

export async function POST(request: NextRequest) {
  const requiredFields = ["reference"];
  return callApiPost(request, "/courriers/envoyer-email-suivre", requiredFields);
}
