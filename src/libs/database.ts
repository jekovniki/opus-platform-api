import admin from 'firebase-admin';
import { IDatabase } from '../interfaces/libs/database';
import { DATABASE } from '../utils/configuration';


export class Database implements IDatabase {
    private database: admin.app.App;

    constructor(database:admin.app.App) {
        this.database = database;
    }

    public query(): admin.firestore.Firestore {
        return this.database.firestore();
    }
}

export const database = new Database(admin.initializeApp({
    credential: admin.credential.cert(DATABASE)
}));