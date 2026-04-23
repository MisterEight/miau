import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { noticias } from '../db/schema';

const router = Router();

router.get('/', async (_req, res) => {
  const rows = await db.select().from(noticias);
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const [row] = await db.select().from(noticias).where(eq(noticias.id, id));
  if (!row) return res.status(404).json({ error: 'Não encontrada' });
  res.json(row);
});

router.post('/', async (req, res) => {
  const { titulo, resumo, autor, data, tag, uf, publicada } = req.body;
  if (!titulo || !resumo || !autor || !data || !tag || !uf) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }
  const [inserted] = await db
    .insert(noticias)
    .values({ titulo, resumo, autor, data, tag, uf, publicada: !!publicada, leituras: 0, comentarios: 0 })
    .returning();
  res.status(201).json(inserted);
});

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { titulo, resumo, autor, data, tag, uf, leituras, comentarios, publicada } = req.body;
  const fields: Record<string, unknown> = {};
  if (titulo !== undefined) fields.titulo = titulo;
  if (resumo !== undefined) fields.resumo = resumo;
  if (autor !== undefined) fields.autor = autor;
  if (data !== undefined) fields.data = data;
  if (tag !== undefined) fields.tag = tag;
  if (uf !== undefined) fields.uf = uf;
  if (leituras !== undefined) fields.leituras = leituras;
  if (comentarios !== undefined) fields.comentarios = comentarios;
  if (publicada !== undefined) fields.publicada = publicada;

  const [updated] = await db.update(noticias).set(fields).where(eq(noticias.id, id)).returning();
  if (!updated) return res.status(404).json({ error: 'Não encontrada' });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const [deleted] = await db.delete(noticias).where(eq(noticias.id, id)).returning();
  if (!deleted) return res.status(404).json({ error: 'Não encontrada' });
  res.json({ ok: true });
});

export default router;
