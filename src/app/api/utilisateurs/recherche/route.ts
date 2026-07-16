import { NextRequest } from "next/server";
import { callApiPost } from "@/lib/callApi";

export async function POST(request: NextRequest) {
    const requiredFields: string[] = [];
    const allowedParams: string[] = ["limit"];
    return callApiPost(request, "utilisateurs/recherche", requiredFields,false,allowedParams);
}
