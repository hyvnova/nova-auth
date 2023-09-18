export enum CheckResult {
    available = "available",
    invalid = "invalid",
    taken = "taken",
    empty = "empty" // When the value is empty, no "feedback" is shown
}


export type UserData = {
    username: string;
    password: string; // Hashed password
    email: string;
    token: string;
    avatar: string;
}

// Public data
export type ProfileData = {
    username: string;
    avatar: string;
}


// Used to fill in the missing fields when adding a user. Avoids having undefined fields if a new field is added to UserData
export const DEFAULT_USER_DATA: UserData = {
    username: "",
    password: "",
    email: "",
    token: "",
    avatar: ""
}

export const REGEX_USERNAME = /^[a-z0-9_]{1,24}$/;
export const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const REGEX_IMAGE_URL = /\.(jpg|jpeg|png|gif|bmp|svg)$/i;
