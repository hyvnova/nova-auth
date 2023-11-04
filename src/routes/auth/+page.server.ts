import { get_by } from "$lib/server/db";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { generate_access_token } from "$lib/server/acess_token";


const WantPossibleValues = ["email", "avatar", "username"]; 

export const load: PageServerLoad = async ({ cookies, url }) => {

    let HOST = url.origin;

    let params = new URLSearchParams(url.search);

    let callback = decodeURIComponent(params.get("callback") || ""); // URL to redirect to after authorization
    let who = decodeURIComponent(params.get("who") || ""); // Api key
    let want = decodeURIComponent(params.get("want") || "").split(",") as string[]; // What data to return, separated by commas.


    // Verify that all parameters are present
    if (!callback || !who || !want) {
        throw redirect(302, callback + "?success=false&error=" + encodeURIComponent("Missing parameters. Required parameters: callback (callback url), who (nova-auth API key), want (comma-separated Ex. username,email,avatar)"));
    }

    // Verify that the user exists
    let requester = await get_by(who);

    if (!requester) {
        throw redirect(302, callback + "?success=false&error=" + encodeURIComponent("Invaled `who` parameter. User not found."));
    }

    // Validate requested data
    for (let field of want) {
        if (!WantPossibleValues.includes(field)) {
            throw redirect(302, callback + "?success=false&error=" + encodeURIComponent(`Invalid field: ${field} at want parameter. Possible values: ` + WantPossibleValues.join(", ")));
        }
    }

    let return_data = {
        username: requester.username,
        avatar: requester.avatar,
        verified: requester.verified,
        want,
    }

    // Check if user it's already logged in, if so, user will be asked to confirm if they want authorize requester to access their data
    let token = cookies.get("token");
    if (token) {

        // Get user data
        let user_data = await get_by(token);

        // If user doesn't exist, redirect to callback url with error
        if (!user_data) {
            throw redirect(302, callback + "?success=false&error=" + encodeURIComponent("Failed to authenticate user. User not found."));
        }

        let params = new URLSearchParams({
            success: "true",
            token: generate_access_token(who, user_data.username, want)
        });
          
        return {
            ...return_data,
            logged_in: true,
            callback: callback + "?" + params.toString(),
            auth_username: user_data.username // Username of the user that is logged in
        }
    }

    // If user is not logged in, they will be asked to login or deny access to their data
    return {
        ...return_data,
        logged_in: false,
        callback: encodeURIComponent(callback)
    }

};
