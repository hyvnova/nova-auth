import type { PageServerLoad, Actions } from "./$types"
import { get_by_token, get_user_profile, update_user } from "$lib/server/db"
import { error, redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ cookies, params, url }) => {
    // Get the prfile username from the params (It's a valid username)
    const username = decodeURIComponent(params.username);

    // Whether to show the edit buttons or not
    const show_edit = url.searchParams.get("show_edit") === "true";

    // Get the token from the cookies
    const token = cookies.get("token")

    // Whether the user it's the "owner" of the profile, used for enabling edit buttons
    let owner = false;

    // If the token is present, check ownership
    if (token) {
        // Get the user data from the token
        const user = await get_by_token(token);
        if (user) {
            // If the user is found, check if the username matches
            owner = user.username === username;
        }
    }

    // Get user profile data
    const profile = await get_user_profile(username);

    // If the profile is not found,go to error page
    if (!profile) {
        throw error(404, "Profile not found");
    }

    return {
        owner,
        username,
        avatar: profile.avatar,
        show_edit
    }
}

export const actions = {
    update_username: async ({ request, cookies }) => {
        // Field it's required and validated
        let new_username = (await request.formData()).get("username") as string;

        // Get the token from the cookies
        const token = cookies.get("token") as string;

        await update_user(token, {
            username: new_username
        });

        throw redirect(302, "/profile/" + new_username)

    }
} as Actions;