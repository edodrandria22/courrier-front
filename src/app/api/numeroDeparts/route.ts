import { NextRequest } from "next/server";
import { callApiGet, callApiPost } from "@/lib/callApi";

export async function GET(request: NextRequest) {
    const requiredFields = ["isSend"];
    return callApiGet(request, "numeroDeparts", requiredFields);
}
export async function POST(request: NextRequest) {
    const requiredFields = ["numero","isSend"];
    return callApiPost(request, "numeroDeparts", requiredFields);
}
