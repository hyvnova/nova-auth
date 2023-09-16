
import type { UserData } from '$lib/types';
import { randomUUID } from 'crypto';
import type { Db } from 'mongodb';
import 'dotenv/config';


// Development DB it's a simple JSON file ./db.json
if (!import.meta.env.DEV) {
    throw new Error("This file should only be used in development mode");
}


import { MongoClient, ServerApiVersion } from 'mongodb';

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

export async function with_db(fn: (db: Db) => Promise<any>) {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        return await fn(client.db(DB_NAME));

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }

}

export async function add_user(data: UserData) {
    await with_db(async db => {
        const collection = db.collection<UserData>("users");

        data.token = randomUUID();

        await collection.insertOne(data);
    });
}

export async function get_user(username: string) {
    return await with_db(async db => {
        const collection = db.collection("users");
        return await collection.findOne({
            username
        });
    });
}

export async function get_user_token(username: string): Promise<string | null> {
    return await with_db(async db => {
        let user_data = await db.collection("users").findOne<UserData>({ username });

        if (!user_data) {
            return null;
        }
        return user_data.token;
    });
}

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
