import type { Actions, PageServerLoad } from "./$types";
import {get_by, get_from, add_user } from "../../lib/server/db";
import { redirect } from "@sveltejs/kit";
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import type { UserData } from "$lib/types";


// Callback url to redirect to after authentication
let auth_callback: string | null = null;


/**
 * Load function to check if user is already logged in
 * If logged in, redirects to /me
 */
export const load: PageServerLoad = async ({ cookies, url }) => {
    // If token is present, then user is already logged in -> redirect to /me
    if (cookies.get("token")) {
        throw redirect(302, "/me");
    }

    // Get callback url from url params (if present, this is used when authenticating)
    let params = new URLSearchParams(url.search);
    let callback = params.get("callback");

    if (callback) {
        auth_callback = decodeURIComponent(callback) + "?success=true&access_token=" + params.get("access_token");
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
        const password = data.get("password") as string

        // If email is present, then it's a sign up form
        if (email) {
            await add_user({
                username,
                email,
                password: bcrypt.hashSync(password)
            });
        } else {
            // Otherwise it's a login form
            const user = await get_by(username) as UserData;

            // If password is incorrect, then it's an error
            if (!bcrypt.compareSync(password, user.password)) {
                return { success: false, error: "Incorrect password" };
            }
        }

        // Get token from database to check if user exists / everything is correct
        let token = await get_from(username, "token");
        
        if (!token) {
            return { success: false, error: "User not found" };
        }

        // Save token to session cookie
        cookies.set("token", token, {
            path: "/",
            secure: process.env.NODE_ENV === "production"
        });
        cookies.set("username", username, {
            path: "/",
            secure: process.env.NODE_ENV === "production"
        });

        // If auth_params is present, then it's an authentication request
        if (auth_callback) {
            throw redirect(302, auth_callback);
        }

        // If everything is correct, then redirect to /me
        throw redirect(302, "/me");
    }
} satisfies Actions;