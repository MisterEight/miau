import express from 'express';
import { initDb } from './db';
import noticiasRouter from './routes/noticias';

const app = express();
app.use(express.json());

initDb();

app.use('/noticias', noticiasRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
