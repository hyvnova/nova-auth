import { json, type RequestHandler } from "@sveltejs/kit";


enum ActionType {
    login = "login",
    signup = "signup",
    logout = "logout"
}

type ExpectedParams = {
    action?:  ActionType,
}

export const POST: RequestHandler = async ({ request, cookies }) => {
    let data: ExpectedParams = await request.json();

    let { action } = data;

    // Check if all parameters are present
    if (!action) {
        return json({
            error: "Missing parameters. Required parameters: action: string (login, signup, logout)"
        }, {status: 400})
    }

    // Check if action is valid
    if (!(action in ActionType)) {
        return json({
            error: "Invalid action. Valid actions: login, signup, logout"
        }, {status: 400})
    }

    switch (action) {
        // TODO: Implement login, signup
        case ActionType.login:
            break;

        case ActionType.signup:
            break;

        case ActionType.logout:
            // Check if user is logged in
            if (!cookies.get("token")) {
                return json({
                    error: "You are not logged in"
                }, {status: 400})
            }

            // Remove token from cookies
            cookies.delete("token", {
                path: "/",
                secure: process.env.NODE_ENV === "production",
            });

            return json({
                success: true
            }, {status: 200})

    }
// TODO: Implement login, signup (This is here because of typescript)
    return json({
        success: true
    }, {status: 200})
}
