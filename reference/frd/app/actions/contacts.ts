"use server";

import { revalidatePath } from "next/cache";
import { ContactMessage } from "@/lib/db/models";

export async function markMessageAsRead(id: number) {
  const message = await ContactMessage.findByPk(id);
  if (message) {
    await message.update({ isRead: true });
    revalidatePath("/admin/contacts");
  }
}

export async function deleteContactMessage(id: number) {
  const message = await ContactMessage.findByPk(id);
  if (message) {
    await message.destroy();
    revalidatePath("/admin/contacts");
  }
}
