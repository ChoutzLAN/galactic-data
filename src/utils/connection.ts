// src/utils/connection.ts
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { initializeApp, cert, getApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const secretClient = new SecretManagerServiceClient();

let firestoreDb: any;

export async function connectToFirestore() {
  if (!firestoreDb) {
    if (getApps().length === 0) {
      const projectId = process.env.GCP_PROJECT_ID; // Use environment variable
      const secretName = `projects/${projectId}/secrets/SECRET_FIRESTORE_PRIVATE_KEY/versions/latest`;

      try {
        const [version] = await secretClient.accessSecretVersion({ name: secretName });
        const serviceAccountJSON = (version?.payload?.data || '').toString();
        const serviceAccount = JSON.parse(serviceAccountJSON);
        initializeApp({
          credential: cert(serviceAccount),
        });
        console.log('Firebase app initialized with Firestore credentials from Secret Manager.');
      } catch (error) {
        console.error('Failed to initialize Firebase app with Firestore credentials:', error);
        throw error; // Enhanced error handling
      }
    }
    firestoreDb = getFirestore(getApp());
  }
  return firestoreDb;
}

export const db = () => {
  if (!firestoreDb) {
    throw new Error("Firestore is not initialized yet.");
  }
  return firestoreDb;
};
