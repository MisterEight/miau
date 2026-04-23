import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { noticias } from './schema';
import * as schema from './schema';

const sqlite = new Database('miau.db');
export const db = drizzle(sqlite, { schema });

const SEED = [
  { titulo: 'Jesus Esclarece que Retorno Será Limitado ao Negócio de Carpintaria', resumo: 'O Filho de Deus confirmou que sua Segunda Vinda focará exclusivamente em projetos de marcenaria.', autor: 'Ana Souza', data: '30 mar 2026', tag: 'Cultura', uf: 'SP', leituras: 4821, comentarios: 37, publicada: true },
  { titulo: 'Cientistas Descobrem que Café é Tecnicamente um Vegetal', resumo: 'Estudo publicado na revista Nature confirma que consumidores de café estão cumprindo metas de alimentação saudável.', autor: 'Bruno Lima', data: '2 abr 2026', tag: 'Ciência', uf: 'RJ', leituras: 3150, comentarios: 22, publicada: true },
  { titulo: 'Prefeitura Anuncia que Semáforo Piscando Amarelo É Feature, Não Bug', resumo: 'Secretaria de Trânsito esclarece que o comportamento é intencional.', autor: 'Elisa Ramos', data: '5 abr 2026', tag: 'Política', uf: 'MG', leituras: 2900, comentarios: 58, publicada: true },
  { titulo: 'Desenvolvedor Afirma que Vai Refatorar Código "Amanhã" pelo Quinto Ano Consecutivo', resumo: 'Código escrito "só pra testar" em 2020 ainda roda em produção.', autor: 'Ana Souza', data: '8 abr 2026', tag: 'Tecnologia', uf: 'SP', leituras: 7643, comentarios: 94, publicada: true },
  { titulo: 'Pesquisa Mostra que 100% das Plantas Morrem Quando Ninguém Cuida', resumo: 'Estudo de 3 anos confirma que plantas precisam de água para sobreviver.', autor: 'Carla Nunes', data: '10 abr 2026', tag: 'Ciência', uf: 'RS', leituras: 1200, comentarios: 11, publicada: false },
];

export function initDb() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS noticia (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo      TEXT    NOT NULL,
      resumo      TEXT    NOT NULL,
      autor       TEXT    NOT NULL,
      data        TEXT    NOT NULL,
      tag         TEXT    NOT NULL,
      uf          TEXT    NOT NULL,
      leituras    INTEGER NOT NULL DEFAULT 0,
      comentarios INTEGER NOT NULL DEFAULT 0,
      publicada   INTEGER NOT NULL DEFAULT 0
    );
  `);

  const count = sqlite.prepare('SELECT COUNT(*) as n FROM noticia').get() as { n: number };
  if (count.n === 0) {
    db.insert(noticias).values(SEED).run();
  }
}
