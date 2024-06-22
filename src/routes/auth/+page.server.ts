import { get_by, get_from } from "$lib/server/db";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { generate_access_token } from "$lib/server/access_token";


const WantPossibleValues = ["email", "avatar", "username", "verified"];

export const load: PageServerLoad = async ({ cookies, url }) => {

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

    // Verify that the callback is of a trusted domian of the requester 
    if (!isTrustedDomain(callback, requester.trusted_domains)) {
        throw redirect(302, callback + "?success=false&error=" + encodeURIComponent("Invalid callback URL. It must be a trusted domain of the requester. If you are the owner of this API ID, Check your `Trusted Domains` sections in your account settings."));
    }

    // Validate requested data
    for (let field of want) {
        if (!WantPossibleValues.includes(field)) {
            throw redirect(302, callback + "?success=false&error=" + `Invalid field: ${field} at want parameter. Possible values: ` + WantPossibleValues.join(", "));
        }
    }
    let return_data = {
        req: {
            username: requester.username,
            avatar: requester.avatar,
            verified: requester.verified,
        },
        callback,
        want,
        logged_in: false
    }

    // Check if user it's already logged in, if so, user will be asked to confirm if they want authorize requester to access their data
    let token = cookies.get("token");
    if (token) {

        // Get user data
        let username = await get_from(token, 'username') as string;
        let access_token = encodeURIComponent(await generate_access_token(who, username, want));

        return {
            ...return_data,
            logged_in: true,
            access_token,
            username // Username of the user that is logged in
        }
    }

    // If user is not logged in, they will be asked to login or deny access to their data
    return {
        ...return_data,
        partcial_token: encodeURIComponent(await generate_access_token(who, "", want)) // Partial token, used to avoid leaking api key
    }

};


function isTrustedDomain(callback: string, trustedDomains: string[]): boolean {
  // Helper function to normalize URLs (removes trailing slashes)
  const normalizeUrl = (url: string) => url.replace(/\/+$/, "");

  try {
    const callbackUrl = new URL(callback);

    return trustedDomains.some((domain) => {
      const trustedUrl = new URL(domain);
      // Normalize both URLs for comparison
      const normalizedCallbackOrigin = normalizeUrl(callbackUrl.origin);
      const normalizedTrustedOrigin = normalizeUrl(trustedUrl.origin);

      // Check if the origins match
      if (normalizedCallbackOrigin !== normalizedTrustedOrigin) {
        return false;
      }

      // Check if the callback path starts with the trusted domain path
      const normalizedCallbackPath = normalizeUrl(callbackUrl.pathname);
      const normalizedTrustedPath = normalizeUrl(trustedUrl.pathname);
      return normalizedCallbackPath.startsWith(normalizedTrustedPath);
    });
  } catch (error) {
    console.error("Invalid URL:", error);
    return false;
  }
}