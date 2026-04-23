import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

const sqlite = openDatabaseSync('miau.db');
export const db = drizzle(sqlite, { schema });

export async function initDb() {
  await sqlite.execAsync(`
    CREATE TABLE IF NOT EXISTS noticia (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo     TEXT    NOT NULL,
      resumo     TEXT    NOT NULL,
      autor      TEXT    NOT NULL,
      data       TEXT    NOT NULL,
      tag        TEXT    NOT NULL,
      uf         TEXT    NOT NULL,
      leituras   INTEGER NOT NULL DEFAULT 0,
      comentarios INTEGER NOT NULL DEFAULT 0,
      publicada  INTEGER NOT NULL DEFAULT 0
    );
  `);
}
