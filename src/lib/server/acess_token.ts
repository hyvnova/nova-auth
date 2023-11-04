
import 'dotenv/config';
import crypto from 'crypto';

/**
 * Generate an access token
 * token will be a encrypted containing who::username::wanted 
 * @param who - The API key of the requester
 * @param username - The username of the user to generate the token for
 * @param wanted - What data was requested and accepted by the user
 * @returns The access token
 */
export function generate_access_token(who: string, username: string, wanted: string[]): string {
    const tokenString = `${who}::${username}::${wanted.join(',')}`;
    const cipher = crypto.createCipher('aes-256-cbc', process.env.ACCESS_TOKEN_SECRET as string);
    let encryptedToken = cipher.update(tokenString, 'utf8', 'base64');
    encryptedToken += cipher.final('base64');

    return encryptedToken;
}

type AccessTokenType = {
    who: string,
    username: string,
    wanted: string[]
}

/**
 * Break an access token into it's parts
 * @param token 
 * @returns  The access token parts
 */
export function break_access_token(token: string): AccessTokenType | null {
    try {
        const decipher = crypto.createDecipher('aes-256-cbc', process.env.ACCESS_TOKEN_SECRET as string);
        let decryptedToken = decipher.update(token, 'base64', 'utf8');
        decryptedToken += decipher.final('utf8');

        const [who, username, wantedParts] = decryptedToken.split('::');
        const wanted = wantedParts.split(',');

        return { who, username, wanted } as AccessTokenType;
    } catch (error) {
        console.error('Token decryption failed:', error);
        return null;
    }
}