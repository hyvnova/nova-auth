import type { Actions, PageServerLoad } from "./$types";
import { is_token_valid, get_user, get_user_token, add_user_partial } from "../../lib/server/db";
import { redirect } from "@sveltejs/kit";
import bcrypt from 'bcryptjs';

/**
 * Load function to check if user is already logged in
 * If logged in, redirects to /me
 */
export const load: PageServerLoad = async ({ cookies }) => {
    if (cookies.get("token") && await is_token_valid(cookies.get("token") as string)) {
        throw redirect(302, "/me");
    }
}

/**
 * Actions object containing default action
 * Handles both sign up and login forms submission
 * In case of error, returns { success: false, error: string }
 * In case of success (login or sign up), will redirect to /me
 */
export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const username = data.get("username") as string;
        const email = data.get("email") as string;
        const password = await bcrypt.hash(data.get("password") as string, 10);

        // If email is present, then it's a sign up form
        if (email) {
            await add_user_partial({
                username,
                email,
                password
            });
        } else {
            // Otherwise it's a login form
            const user = await get_user(username);

            // If user is not found, then it's an error
            if (!user) {
                return { success: false, error: "User not found" };
            }

            // If password is incorrect, then it's an error
            if (user.password !== password) {
                return { success: false, error: "Incorrect password" };
            }
        }

        // Get token from database to check if user exists / everything is correct
        const token = await get_user_token(username);

        if (!token) {
            return { success: false, error: "User not found" };
        }

        // Save token to session cookie
        cookies.set("token", token);

        // If everything is correct, then redirect to /me
        throw redirect(302, "/me");
    }
} satisfies Actions;