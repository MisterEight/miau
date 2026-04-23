import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const noticias = sqliteTable('noticia', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  titulo: text('titulo').notNull(),
  resumo: text('resumo').notNull(),
  autor: text('autor').notNull(),
  data: text('data').notNull(),
  tag: text('tag').notNull(),
  uf: text('uf').notNull(),
  leituras: integer('leituras').notNull().default(0),
  comentarios: integer('comentarios').notNull().default(0),
  publicada: integer('publicada', { mode: 'boolean' }).notNull().default(false),
});
