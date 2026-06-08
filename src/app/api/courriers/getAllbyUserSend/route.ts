import { NextRequest } from "next/server";
import { callApiGet } from "@/lib/callApi";

export async function GET(request: NextRequest) {
  const allowed = ["date"];
  return callApiGet(request, "/courriers/getAllbyUserSend", allowed);
}
