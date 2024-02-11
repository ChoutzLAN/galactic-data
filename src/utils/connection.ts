// src\utils\connection.ts
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

export const connectToFirestore = () => {
    if (getApps().length === 0) { // Check if a Firebase app has already been initialized
        const serviceAccountPath = process.env.FIRESTORE_PRIVATE_KEY_PATH_LOCAL;

        if (!serviceAccountPath) {
            throw new Error('FIRESTORE_PRIVATE_KEY_PATH_LOCAL environment variable is not set.');
        }

        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

        initializeApp({
            credential: cert(serviceAccount)
        });
    } else {
        console.log('Firebase app already initialized, using existing app.');
    }

    const db = getFirestore(getApp()); // Use the existing app if already initialized
    console.log('Connected to Firestore');

    return db;
};
// Export the Firestore database instance
export const db = connectToFirestore();

