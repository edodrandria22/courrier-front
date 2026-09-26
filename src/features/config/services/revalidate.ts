// app/actions/revalidate.ts
'use server';

import { revalidateTag, updateTag } from 'next/cache';

export async function revalidateEntites() {
  revalidateTag('liste-entites','max');
}

export async function revalidateEmployeurs() {
  revalidateTag('liste-employeurs','max');
}
export async function revalidateRoles(){
  revalidateTag('liste-roles','max');
}
export async function revalidateAll() {
  revalidateTag('liste-entites','max');
  revalidateTag('liste-employeurs','max');
  revalidateTag('liste-roles','max');
}