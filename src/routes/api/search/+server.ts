import { find_matching } from "$lib/server/db";
import { json, type RequestHandler } from "@sveltejs/kit";



type ExpectedParams = {
    query: string, // Search query (username, email)
}

export const POST: RequestHandler = async ({ request }) => {
    let data: ExpectedParams = await request.json();

    let { query } = data;

    // Check if all parameters are present
    if (!query) {
        return json({
            error: "Missing parameters. Required parameters: query: string"
        }, {status: 400})
    }
    
    // Search for users
    let results = await find_matching(query, ["username", "avatar"]);

    return json({
        success: true,
        results: results ?? []
    }, {status: 200})

};