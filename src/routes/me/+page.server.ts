import type { PageServerLoad } from "./$types"
import { get_by_token } from '$lib/server/db'
import { redirect } from "@sveltejs/kit"

export const load: PageServerLoad = async ({ cookies }) => {
    // Get the token from the cookies
    const token = cookies.get("token")

    // If the token is not present, return to /join
    if (!token) { throw redirect(302, "/join") }

    // Get the user data from the token
    const user = await get_by_token(token);

    // If the user is not found, return to /join
    if (!user) { throw redirect(302, "/join") }

    // Otherwise, return the user data
    return {
        username: user.username,
        email: user.email
    }
}