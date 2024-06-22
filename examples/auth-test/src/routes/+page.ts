
import { SessionState } from '$lib/types';
import type { PageLoad } from './$types';

const endpoint = 'http://localhost:5173';

export const load: PageLoad = async ({ url }) => {
    const params = new URLSearchParams(url.search);
    const success = params.get('success');

    switch (success) {
        case null:
            return {
                state: SessionState.idle,
                auth_url: generateAuthUrl()
            };

        case 'false':
            return {
                state: SessionState.failed,
                error: decodeURIComponent(params.get('error') || ''),
            };

        default: {
            const accessToken = decodeURIComponent(params.get('token') || '');

            const res = await fetch(`${endpoint}/api/user`, {
                method: 'GET',
                headers: {
                    'Authorization': accessToken
                }
            });

            if (!res.ok) {
                return {
                    state: SessionState.failed,
                    error: 'Failed to get user info',
                };
            }

            const user = await res.json();

            return {
                state: SessionState.logged,
                user
            };
        }
    }
};

function generateAuthUrl() {
    const authUrlParams = new URLSearchParams({
        who: 'a847b302-ab2a-4782-9c3e-4cab43904ac3',
        callback: 'http://localhost:5174/',
        want: 'username,avatar'
    });

    return `${endpoint}/auth?${authUrlParams.toString()}`;
}
