export enum CheckResult {
    available = "available",
    invalid = "invalid",
    taken = "taken",
    empty = "empty" // When the value is empty, no "feedback" is shown
}


export type DataAccess = {
    who: string; // Api key
    want: string[]; // What they have access to
    last_used: number; // Last time they used it (seconds since epoch)
    uses: number; // How many times they have used it
}

export type UserData = {
    username: string;
    password: string; // Hashed password
    email: string;
    token: string;
    avatar: string;
    verified: boolean;
    api_key: string;
    accesses: DataAccess[]; // Accesses to user data 
}

// Public data
export type ProfileData = {
    username: string;
    avatar: string;
}

