/*
    * Porpuse: Add or remove trusted domains from user
    
    * Methods: 
        * POST -> JSON { domain: string, action: "add" | "remove" } 
        *         Headers: Authorization (API TOKEN)
*/

import { get_by, update_user } from "$lib/server/db";

import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, request }) => {
  // token is at authoriztion header. Ex <token>
  let token = cookies.get("token");

   // Check if user is logged in
  if (!token) {
      return json({
          error: "You are not authorized to perform this action"
      }, { status: 400 })
  }

  let user = await get_by(token);

  if (!user) {
    return json(
      {
        error: "User not found",
      },
      { status: 400 }
    );
  }

  // Parse the body
  let body = await request.json();

  if (!body.domain || !body.action) {
    return json(
      {
        error:
          "Missing parameters. Required parameters: domain (string), action (add | remove)",
      },
      { status: 400 }
    );
  }

  if (body.action != "add" && body.action != "remove") {
    return json(
      {
        error: "Invalid action. Valid actions: add, remove",
      },
      { status: 400 }
    );
  }

  if (body.action == "add" && !user.trusted_domains.includes(body.domain)) {
      user.trusted_domains.push(body.domain);
  }

  if (body.action == "remove" && user.trusted_domains.includes(body.domain)) {
    user.trusted_domains = user.trusted_domains.filter(
        (domain) => domain != body.domain
    );
  }

    await update_user(token, user);

  return json({}, { status: 200});
};
