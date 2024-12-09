import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export async function openDb(): Promise<Database> {
    return open({
        filename: './database.db',
        driver: sqlite3.Database,
    });
}

export async function initializeDb(): Promise<void> {
    const db = await openDb();
    await db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)');
    await db.run(
        'CREATE TABLE IF NOT EXISTS domains (id INTEGER PRIMARY KEY, user_id INTEGER, domain TEXT, status TEXT, FOREIGN KEY(user_id) REFERENCES users(id))',
    );
}
