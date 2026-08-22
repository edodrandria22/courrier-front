// app/api/messages/transferer/route.ts (ou équivalent)
import { NextRequest } from "next/server";
import { callApiPost } from "@/lib/callApi";
import { revalidatePath } from "next/cache"; // 👈 1. Importer revalidatePath

export async function POST(request: NextRequest) {
  const requiredFields = ["destId", "id"];
  
  // 2. On attend le résultat de l'API backend
  const response = await callApiPost(request, "/messages/transferer", requiredFields, true);
  
  // 3. Si la réponse est un succès (code 200 ou 201)
  if (response.ok) {
    // 👈 4. On vide le cache de la page où s'affiche la liste des messages.
    // Remplacez '/messages' par l'URL réelle de votre page dans le navigateur.
    revalidatePath('/message/courrier/send'); 
  }
  return response;
}