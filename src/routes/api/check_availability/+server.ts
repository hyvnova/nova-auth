import {json,  type RequestHandler } from "@sveltejs/kit"
import { find_by } from "$lib/server/db";
import { CheckResult } from "$lib/types";
import { REGEX_EMAIL, REGEX_USERNAME } from "$lib";

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
        available = await find_by({username: value}) === null;
    }

    // Check if email is available
    else if (type === CheckType.email) {
        available = await find_by({email: value}) === null;
    }

    switch (type) {
        case CheckType.username:
            if (!REGEX_USERNAME.test(value)) {
                return json({
                    result: CheckResult.invalid,
                }, {status: 200})
            }

            available = await find_by({username: value}) === null;
            break;
        
        case CheckType.email:
            // Check if email is valid
            if (!REGEX_EMAIL.test(value)) {
                return json({
                    result: CheckResult.invalid,
                }, {status: 200})
            }

            available = await find_by({email: value}) === null;
            break;

        default:
    }

    return json({
        result: available ? CheckResult.available : CheckResult.taken,
    }, {status: 200})

};