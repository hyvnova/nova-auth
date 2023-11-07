/*
    Porpuse: Manage user's API key

    Methods: 
        GET -> Generate new API key
        DELETE -> Delete API key

    Returns:
        200: OK
        400: Bad Request
        401: Unauthorized
*/


import { update_user } from "$lib/server/db";
import { json, type RequestHandler } from "@sveltejs/kit";
import { v4 as uuid } from "uuid"; 

// Generate new API key
export const GET: RequestHandler = async ({ cookies }) => {

    let token = cookies.get("token");

    // Check if user is logged in
    if (!token) {
        return json({
            error: "You are not authorized to perform this action"
        }, { status: 400 })
    }
    
    let key = uuid();

    update_user(token, { api_key: key });
    return json({
        key: key
    }, { status: 200 })

}


// Delete API key
export const DELETE: RequestHandler = async ({ request, cookies }) => {
    let token = cookies.get("token");

    // Check if user is logged in
    if (!token) {
        return json({
            error: "You are not authorized to perform this action"
        }, { status: 401 })
    }

    update_user(token, { api_key: "" });
    return json({
        success: true
    }, { status: 200 })
}