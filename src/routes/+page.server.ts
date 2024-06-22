import { get_by } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
  // Get the token from the cookies
  const token = cookies.get("token");

  // If the token is not present, return to /join
  if (!token) {
    return { logged: false }
  }

  // Get the user data from the token
  const user = await get_by(token);

  // If the user is not found, return to /join
  if (!user) {
    return { logged: false }
  }

  // Otherwise, return the user data
  return {
    logged: true
  }
};
