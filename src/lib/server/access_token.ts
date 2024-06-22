
import 'dotenv/config';
import crypto from 'crypto';

let silly_string = process.env.ACCESS_TOKEN_SECRET || "Please don't forget the token UnU would be very bad for security. Cry BOZO LMAO";

/**
 * Generate an access token
 * token will be a encrypted containing who::username::want 
 * @param who - The API key of the requester
 * @param username - The username of the user to generate the token for
 * @param want - What data was requested and accepted by the user
 * @returns The access token
 */
export async function generate_access_token(who: string, username: string, want: string[]) {
    const tokenString = `${who}::${username}::${want.join(',')}`;
    const cipher = crypto.createCipher('aes-256-cbc', silly_string);
    let encryptedToken = cipher.update(tokenString, 'utf8', 'base64');
    encryptedToken += cipher.final('base64');

    return encryptedToken;
}

export type AccessTokenType = {
    who: string,
    username: string,
    want: string[]
}

/**
 * Break an access token into it's parts
 * @param token 
 * @returns  The access token parts
 */
export function break_access_token(token: string): AccessTokenType | null {
    if (!token) return null;
    try {
        const decipher = crypto.createDecipher('aes-256-cbc', silly_string);
        let decryptedToken = decipher.update(token, 'base64', 'utf8');
        decryptedToken += decipher.final('utf8');

        const [who, username, wantParts] = decryptedToken.split('::');
        const want = wantParts.split(',');

        return { who, username, want } as AccessTokenType;
    } catch (error) {
        return null;
    }
}