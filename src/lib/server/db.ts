import { DEFAULT_USER_DATA, type ProfileData, type UserData } from '$lib/types';
import { randomUUID } from 'crypto';
import type { Db } from 'mongodb';
import 'dotenv/config';

// This file should only be used in development mode
if (!import.meta.env.DEV) {
    throw new Error("This file should only be used in development mode");
}

import { MongoClient, ServerApiVersion } from 'mongodb';

// Database URI and name
const DB_URI = process.env.DB_URI || "";
const DB_NAME = import.meta.env.DEV ? "dev" : "prod";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(DB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Function to connect to the database and execute a function
export async function with_db(fn: (db: Db) => Promise<any>) {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        return await fn(client.db(DB_NAME));
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

// Function to add a user with all the fields from UserData
export async function add_user(data: UserData) {
    await with_db(async db => {
        const collection = db.collection<UserData>("users");
        data.token = randomUUID();
        await collection.insertOne(data);
    });
}

// Function to add a user with partial data. The rest of the fields will be filled with the default values from DEFAULT_USER_DATA
export function add_user_partial(data: Partial<UserData>) {
    return with_db(async db => {
        const collection = db.collection<UserData>("users");
        data.token = randomUUID();
        // fill in the missing fields
        const user_data: UserData = { ...DEFAULT_USER_DATA, ...data };

        // Assign a default avatar 
        const avatar_id = Math.floor(Math.random() * 4) + 1;
        user_data.avatar ||= "/default_avatars/" + avatar_id + ".jpg";

        await collection.insertOne(user_data);
    });
}

// Function to get a user by username
export async function get_user(username: string) {
    return await with_db(async db => {
        const collection = db.collection("users");
        let user = await collection.findOne({
            username
        });

        if (!user) {
            return null;
        }

        // Remove password and token from user data
        user.password = "";
        user.token = "";

        return user;
    });
}

// Function to get a user's token by username
export async function get_user_token(username: string): Promise<string | null> {
    return await with_db(async db => {
        let user_data = await db.collection("users").findOne<UserData>({ username });
        if (!user_data) {
            return null;
        }
        return user_data.token;
    });
}

// Function to get a user by token
export async function get_by_token(token: string): Promise<UserData | null> {
    return await with_db(async db => {
        let user_data = await db.collection("users").findOne<UserData>({ token });
        if (!user_data) {
            return null;
        }
        // Remove token from user data
        user_data.token = "";
        return user_data;
    });
}

// Function to check if a username is available
export async function username_available(username: string): Promise<boolean> {
    try {
        return await with_db(async db => {
            const collection = db.collection("users");
            return await collection.findOne({
                username
            }) === null;
        });
    } catch (e) {
        return false;
    }
}

// Function to check if an email is available
export async function email_available(email: string): Promise<boolean> {
    try {
        return await with_db(async db => {
        const collection = db.collection("users");
        return await collection.findOne({
            email
        }) === null;
    });
    } catch (e) {
        return false;
    }
}

// Function to get a user by email
export async function get_user_by_email(email: string): Promise<UserData | null> {
    return await with_db(async db => {
        const collection = db.collection("users");
        return await collection.findOne({
            email
        });
    });
}

// Function to check if a token is valid
export async function is_token_valid(token: string): Promise<boolean> {
    return await with_db(async db => {
        const collection = db.collection("users");
        return await collection.findOne({
            token
        }) !== null;
    });
}

export async function get_user_profile(username: string): Promise<ProfileData | null> {
    return await with_db(async db => {
        const collection = db.collection("users");
        let user =  await collection.findOne<UserData>({
            username
        });

        if (!user) {
            return null;
        }

        return {
            username: user.username,
            avatar: user.avatar,
        }
    });
}

export async function update_user(token: string, data: Partial<UserData>) {
    return await with_db(async db => {
        const collection = db.collection("users");
        await collection.updateOne({
            token
        }, {
            $set: data
        });
    });
}