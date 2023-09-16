import { writable } from 'svelte/store';
import { browser } from '$app/environment';


type Session = {
    token?: string;
}


// Check if the environment is a browser
// If it is, try to retrieve the 'nova-auth-session' from localStorage and parse it
// If the retrieval or parsing fails, default to an empty object
// If the environment is not a browser, also default to an empty object
const initial_value = browser 
    ? (JSON.parse(localStorage.getItem('nova-auth-session') || "{ token: undefined }") || { token: undefined})
    : {};

const session = writable<Session>(initial_value);

session.subscribe((value: Session) => {
    if (browser) {
        console.log("Saving session", value);
        localStorage.setItem('nova-auth-session', JSON.stringify(value));
    }
});
    
export default session;