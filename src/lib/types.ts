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
}