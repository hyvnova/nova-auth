import type { Actions } from "./$types";
import { add_user, get_user, get_user_token } from "../../lib/server/db";
import { redirect } from "@sveltejs/kit";
import bcrypt from 'bcryptjs';


export const actions = {
    // Default actions takes in all form data, could be sing up or login
    /*
    Sign up form data:
    username: string
    email: string 
    password: string

    Login form data:
    username: string
    password: string
    */

    // @ts-ignore
    default: async ({ request, cookies }) => {
        /*
        Handles both sign up and login forms submission
        In case of error, returns { success: false, error: string }
        In case of success (login or sign up), will redirect to /me
        */

        const data = await request.formData();


        // All parameters are required and validated by the form
        const username = data.get("username") as string;
        const email = data.get("email") as string;

        // Hash password
        const password = await bcrypt.hash(data.get("password") as string, 10);

        // If email is present, then it's a sign up form
        if (email) {
            await add_user({
                username,
                email,
                password,
                token: "" // Will be set by add_user
            });

        // Otherwise it's a login form
        } else {
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

        // Get id from database
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