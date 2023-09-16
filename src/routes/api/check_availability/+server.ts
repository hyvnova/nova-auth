import {json,  type RequestHandler } from "@sveltejs/kit"
import { username_available, email_available} from "$lib/server/db";

/*
    POST /api/check_availability
    Used for checking if a username or email is available

    Expected parameters (in json body):
        - type: string (either "username" or "email")
        - value: string

    Returns:
        - available: boolean (true if is available, false otherwise)
*/

enum CheckType {
    username = "username",
    email = "email"
}

type ExpectedParams = {
    type?: CheckType,
    value?: string
}

enum CheckResult {
    available = "available",
    invalid = "invalid",
    taken = "taken"
}

export const POST: RequestHandler = async ({ request }) => {
    let data: ExpectedParams = await request.json();

    let { type, value } = data;

    // Check if all parameters are present
    if (!type || !value) {
        return json({
            error: "Missing parameters. Required parameters: type: string, value: string"
        }, {status: 400})
    }

    // Check if type is valid
    if (!(type in CheckType)) {
        return json({
            error: "Invalid type. Valid types: username, email"
        }, {status: 400})
    }

    // Check if username is available
    let available: boolean = false;
    if (type === CheckType.username) {
        available = await username_available(value);
    }

    // Check if email is available
    else if (type === CheckType.email) {
        available = await email_available(value);
    }

    switch (type) {
        case CheckType.username:
            const usernameRegex = /^[a-zA-Z0-9_]{1,24}$/;
            if (!usernameRegex.test(value)) {
                return json({
                    result: CheckResult.invalid,
                }, {status: 200})
            }

            available = await username_available(value);
            break;
        
        case CheckType.email:
            // Check if email is valid
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(value)) {
                return json({
                    result: CheckResult.invalid,
                }, {status: 200})
            }

            available = await email_available(value);
            break;

        default:
    }

    return json({
        result: available ? CheckResult.available : CheckResult.taken,
    }, {status: 200})

};