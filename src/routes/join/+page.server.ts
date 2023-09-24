import type { Actions, PageServerLoad } from "./$types";
import { find_by, get_by, get_from, add_user } from "../../lib/server/db";
import { redirect } from "@sveltejs/kit";
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import type { UserData } from "$lib/types";


// Callback url to redirect to after authentication
let redirect_callback: string | null;


/**
 * Load function to check if user is already logged in
 * If logged in, redirects to /me
 */
export const load: PageServerLoad = async ({ cookies, url }) => {
    // Get callback url from url params (if present, this is used when authenticating)
    let params = new URLSearchParams(url.search);
    let callback = params.get("callback");
    let want = params.get("want");  // What fields to return, separated by commas. Possible values: email, avatar, username
    
    if (callback) {
        callback = decodeURIComponent(callback);

        // If callback is present, then want is present too
        // @ts-ignore
        want = want.split(",");
    }

    let token = cookies.get("token");

    if (token && await get_by(token)) {

        // If callback is present, then redirect to callback
        if (callback) {
            let params = new URLSearchParams({
                success: "true"
            });

            let user = await get_by(token) as UserData;

            // Reduce user data to avoid leaking data
            let { username, email, avatar } = user;
            let reduced_user_data = { username, email, avatar };

            // @ts-ignore
            for (let field of want) {
                // @ts-ignore
                params.append(field, reduced_user_data[field]);
            }

            throw redirect(302, callback + "?" + params.toString());
        }

        throw redirect(302, "/me");
    }

    // If not logged in, but callback is present save it to callback variable
    redirect_callback = callback;
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
                password: bcrypt.hashSync(password, 11),
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

        // If callback is present, then redirect to callback
        if (redirect_callback) {
            let params = new URLSearchParams({
                success: "true"
            });

            let user = await get_by(token) as UserData;

            // Reduce user data to avoid leaking data
            let { username, email, avatar } = user;
            let reduced_user_data = { username, email, avatar };

            // @ts-ignore
            for (let field of want) {
                // @ts-ignore
                params.append(field, reduced_user_data[field]);
            }

            throw redirect(302, redirect_callback + "?" + params.toString());
        }

        // If everything is correct, then redirect to /me
        throw redirect(302, "/me");
    }
} satisfies Actions;