/*
    Porpuse: Manage API keys
    Method: POST

    Parameters:
        action: string (generate, delete)

    Returns:
        200: OK
        400: Bad Request
        401: Unauthorized
        500: Internal Server Error


    API key generation:
        username + random string  
*/


import { update_user } from "$lib/server/db";
import { json, type RequestHandler } from "@sveltejs/kit";
import { v4 as uuid } from "uuid"; 

enum ActionType {
    generate = "generate",
    delete = "delete", // Delete account
}

type ExpectedParams = {
    action?: ActionType,
}

export const POST: RequestHandler = async ({ request, cookies }) => {
    let data: ExpectedParams = await request.json();

    let { action } = data;

    // Check if all parameters are present
    if (!action) {
        return json({
            error: "Missing parameters. Required parameters: action: string (generate, delete)"
        }, { status: 400 })
    }

    // Check if action is valid
    if (!(action in ActionType)) {
        return json({
            error: "Invalid action. Ex.valid actions: generate, delete"
        }, { status: 400 })
    }


    // Check if user is logged in
    if (!cookies.get("token")) {
        return json({
            error: "You are not authorized to perform this action"
        }, { status: 400 })
    }

    switch (action) {
        case ActionType.generate:
                   
    }

    return json({}, { status: 200 })

}
