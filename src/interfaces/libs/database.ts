import admin from 'firebase-admin';

export interface IDatabase {
    query(): admin.firestore.Firestore;
}