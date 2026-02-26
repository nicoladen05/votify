import { db } from "$lib/server/db";
import { user } from "$lib/server/db/auth.schema";
import { eq } from "drizzle-orm";
import type { Actions, PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { auth } from "$lib/server/auth";

export const load: PageServerLoad = async ({ locals }) => {
  const accountData = db.select().from(user).where(eq(user.id, locals.user!.id));


  return {
    accountData: accountData.then((account) => ({
      email: account[0].email,
      name: account[0].name
  })) }
};

export const actions: Actions = {
  updateAccount: async ({ request, locals }) => {
    const formData = await request.formData();
    const userName = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!userName || !email ) {
      return error(400, "Missing parameters");
    }

    if (locals.user!.name !== userName)
      auth.api.updateUser({ body: { name: userName }, headers: request.headers })

    if (locals.user!.email !== email)
      auth.api.changeEmail({ body: { newEmail: email }, headers: request.headers })
  }
}
