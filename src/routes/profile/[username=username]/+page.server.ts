import type { PageServerLoad, Actions } from "./$types"
import { get_by, get_from, update_user } from "$lib/server/db"
import { error, redirect } from "@sveltejs/kit";
import { REGEX_IMAGE_URL, REGEX_USERNAME } from "$lib";

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
        const user = await get_by(token);

        if (user) {
            // If the user is found, check if the username matches
            owner = user.username === username;

            // If the username is not present in the cookies, set it
            if (!cookies.get("username")) {
                cookies.set("username", user.username);
            }
        }
        // If user is not found, then the token is invalid
        else {
            throw redirect(302, "/join");
        }
    }

    // Get user profile data
    const profile = await get_by(username);

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
        let new_username = (await request.formData()).get("username") as string;

        // Validate username
        if (!new_username || !REGEX_USERNAME.test(new_username)) {  
            return { success: false, error: "Invalid username" };
        }

        // Get the token from the cookies
        const token = cookies.get("token") as string;

        await update_user(token, {
            username: new_username
        });

        throw redirect(302, "/profile/" + new_username)
    },

    update_avatar: async ({ request, cookies }) => {
        let new_avatar = (await request.formData()).get("avatar") as string;

        // Validate avatar
        if (!new_avatar || !REGEX_IMAGE_URL.test(new_avatar)) {
            return { success: false, error: "Invalid avatar" };
        }

        // Make sure the avatar is a valid URL
        try {
            new URL(new_avatar);
        } catch (e) {
            return { success: false, error: "Invalid avatar" };
        }

        // Get the token from the cookies
        const token = cookies.get("token") as string;

        await update_user(token, {
            avatar: new_avatar
        });

        throw redirect(302, "/profile/" + cookies.get("username"))
    }
} as Actions;