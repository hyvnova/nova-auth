/*
    Porpuse: Get user data through access token
    Methods: 
        GET ->  Get user data

    Returns:
        200: OK -> User data
        400: Bad Request
        401: Unauthorized
*/


import { break_access_token } from "$lib/server/access_token";
import { exists, get_by } from "$lib/server/db";
import type { UserData } from "$lib/types";
import { json, type RequestHandler } from "@sveltejs/kit";

// Generate new API key
export const GET: RequestHandler = async ({ url, request }) => {

    // token is at authoriztion header. Ex <token>
    let token = request.headers.get("authorization");

    // Verify that all parameters are present
    if (!token) {
        return json({
            error: "Missing parameters. Required parameters: token (access token)"
        }, { status: 400 })
    }

    let parts = break_access_token(token);

    // null means that token could not be decrypted
    if (!parts) {
        return json({
            error: "Couldn't resolve token"
        }, { status: 401 })
    }

    // verify that requester exists
    if (!await exists(parts.who)) {
        return json({
            error: "Invalid access token, requester does not exist."
        }, { status: 401 })
    }

    let user = await get_by(parts.username);

    // verify that user exists
    if (!user) {
        return json({
            error: "Invalid access token, user does not exist."
        }, { status: 401 })
    }

    let data: Partial<UserData> = {};
    for (let field of parts.want) {
        if (field == "avatar") {
            data[field] = url.origin + user[field];
            continue;
        }

        // @ts-ignore
        data[field] = user[field];
    }

    return json(data, { status: 200 })
}

