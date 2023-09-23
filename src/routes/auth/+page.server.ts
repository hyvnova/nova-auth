import { get_by } from "$lib/server/db";
import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";


type WantedFields = "email" | "avatar" | "username";
const HOST = import.meta.env.DEV ? "http://localhost:5174" : import.meta.env.HOST as string;

export const load: PageServerLoad = async ({ cookies, url }) => {
    let params = new URLSearchParams(url.search);

    let callback = decodeURIComponent(params.get("callback") || ""); // URL to redirect to after authorization
    let who = decodeURIComponent(params.get("who") || ""); // Username or email
    let want = decodeURIComponent(params.get("want") || "").split(",") as WantedFields[]; // What data to return, separated by commas. Possible values: email, avatar, username


    if (!want.includes("username")) {
        want.push("username");
    }

    // Verify that all parameters are present
    if (!callback || !who) {
        throw redirect(302, callback + "?success=false&error=" + encodeURIComponent("Missing parameters. Required parameters: callback (callback url), who (nova-auth usarname), want (comma-separated Ex. email,avatar)"));
    }

    // Verify that the user exists
    let user = await get_by(who);

    if (!user) {
        throw redirect(302, callback + "?success=false&error=" + encodeURIComponent("Invaled `who` parameter. User not found."));
    }

    // Validate requested data
    for (let field of want) {
        if (!["email", "avatar", "username"].includes(field)) {
            throw redirect(302, callback + "?success=false&error=" + encodeURIComponent("Invaled `want` parameter. Possible values: email, avatar, username"));
        }
    }

    // get requester user
    let requester = await get_by(who);

    // If user doesn't exist, redirect to callback
    if (!requester) {
        throw redirect(302, callback + "?success=false&error=" + encodeURIComponent("Invaled `who` parameter. User not found."));
    }

    let return_data = {
        username: requester.username,
        avatar: requester.avatar,
        want,
        verified: requester.verified
    }

    // Check if user it's already logged in
    let token = cookies.get("token");
    if (token) {

        // Get user data
        let user_data = await get_by(token);

        // If user doesn't exist, redirect to callback
        if (!user_data) {
            throw redirect(302, callback + "?success=false&error=" + encodeURIComponent("Failed to authenticate user. User not found."));
        }

        // Reduce user data to avoid leaking data
        let { username, email, avatar } = user_data;

        // Add host to avatar if it's a relative url
        if (avatar.startsWith("/")) {
            avatar = HOST + avatar;
        }

        let reduced_user_data = { username, email, avatar };

        let params = new URLSearchParams({
            success: "true",
        });

        for (let field of want) {
            // @ts-ignore
            params.append(field, reduced_user_data[field]);
        }
          
        return {
            ...return_data,
            logged_in: true,
            callback: callback + "?" + params.toString(),
            auth_username: user_data.username // Username of the user that is logged in
        }
    }



    return {
        ...return_data,
        logged_in: false,
        callback: encodeURIComponent(callback)
    }

};
