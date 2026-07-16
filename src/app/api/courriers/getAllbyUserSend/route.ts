import { NextRequest } from "next/server";
import { callApiGet } from "@/lib/callApi";

export async function GET(request: NextRequest) {
  const allowed = ["date","limit"];
  return callApiGet(request, "/courriers/getAllbyUserSend", allowed);
}
