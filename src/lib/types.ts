import type { Writable } from "svelte/store";

export enum CheckResult {
    available = "available",
    invalid = "invalid",
    taken = "taken",
    empty = "empty" // When the value is empty, no "feedback" is shown
}

export type UserData = {
    trusted_domains: string[];
    username: string;
    password: string; // Hashed password
    email: string;
    token: string;
    avatar: string;
    verified: boolean;
    api_key: string;
}

// Public data
export type ProfileData = {
    username: string;
    avatar: string;
}


export type ToastType = Writable<{
  type: "error" | "info";
  title: string;
  message: string;
  duration?: number;
} | null>;

