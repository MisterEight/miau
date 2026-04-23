import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db, initDb } from '../db';
import { noticias as noticiasTable } from '../db/schema';
import { eq } from 'drizzle-orm';

export type Noticia = {
  id: string;
  titulo: string;
  resumo: string;
  autor: string;
  data: string;
  tag: string;
  uf: string;
  leituras: number;
  comentarios: number;
  publicada: boolean;
};

export type Comentario = {
  id: number;
  autor: string;
  texto: string;
  data: string;
  curtidas: number;
};

export type Tag = {
  id: number;
  nome: string;
  usos: number;
  cor: string;
};

const NOTICIAS_SEED = [
  {
    titulo: 'Jesus Esclarece que Retorno Será Limitado ao Negócio de Carpintaria',
    resumo: 'O Filho de Deus confirmou que sua Segunda Vinda focará exclusivamente em projetos de marcenaria e móveis artesanais.',
    autor: 'Ana Souza',
    data: '30 mar 2026',
    tag: 'Cultura',
    uf: 'SP',
    leituras: 4821,
    comentarios: 37,
    publicada: true,
  },
  {
    titulo: 'Cientistas Descobrem que Café é Tecnicamente um Vegetal',
    resumo: 'Estudo publicado na revista Nature confirma que consumidores de café estão cumprindo metas de alimentação saudável.',
    autor: 'Bruno Lima',
    data: '2 abr 2026',
    tag: 'Ciência',
    uf: 'RJ',
    leituras: 3150,
    comentarios: 22,
    publicada: true,
  },
  {
    titulo: 'Prefeitura Anuncia que Semáforo Piscando Amarelo É Feature, Não Bug',
    resumo: 'Secretaria de Trânsito divulga nota oficial esclarecendo que o comportamento é intencional e visa "testar reflexos dos motoristas".',
    autor: 'Elisa Ramos',
    data: '5 abr 2026',
    tag: 'Política',
    uf: 'MG',
    leituras: 2900,
    comentarios: 58,
    publicada: true,
  },
  {
    titulo: 'Desenvolvedor Afirma que Vai Refatorar Código "Amanhã" pelo Quinto Ano Consecutivo',
    resumo: 'Colegas relatam que o código foi escrito "só pra testar" em 2020 e desde então roda em produção sem alterações.',
    autor: 'Ana Souza',
    data: '8 abr 2026',
    tag: 'Tecnologia',
    uf: 'SP',
    leituras: 7643,
    comentarios: 94,
    publicada: true,
  },
  {
    titulo: 'Pesquisa Mostra que 100% das Plantas Morrem Quando Ninguém Cuida',
    resumo: 'Estudo de 3 anos e R$ 2 milhões confirma que plantas precisam de água para sobreviver.',
    autor: 'Carla Nunes',
    data: '10 abr 2026',
    tag: 'Ciência',
    uf: 'RS',
    leituras: 1200,
    comentarios: 11,
    publicada: false,
  },
];

const COMENTARIOS_INICIAL: Record<string, Comentario[]> = {};

export const TAGS_INICIAL: Tag[] = [
  { id: 1, nome: 'Tecnologia', usos: 12, cor: '#3498DB' },
  { id: 2, nome: 'Ciência', usos: 8, cor: '#2ECC71' },
  { id: 3, nome: 'Política', usos: 15, cor: '#E74C3C' },
  { id: 4, nome: 'Cultura', usos: 6, cor: '#9B59B6' },
  { id: 5, nome: 'Entretenimento', usos: 4, cor: '#F39C12' },
];

const CORES_TAG = ['#3498DB', '#2ECC71', '#E74C3C', '#9B59B6', '#F39C12', '#F0A500', '#E94560'];

type AppStoreContextType = {
  noticias: Noticia[];
  dbReady: boolean;
  addNoticia: (n: Omit<Noticia, 'id' | 'leituras' | 'comentarios'>) => Promise<string>;
  updateNoticia: (id: string, changes: Partial<Noticia>) => void;
  deleteNoticia: (id: string) => void;
  getComentarios: (noticiaId: string) => Comentario[];
  addComentario: (noticiaId: string, texto: string, autor: string) => void;
  tags: Tag[];
  addTag: (nome: string) => void;
  deleteTag: (id: number) => void;
  updateTag: (id: number, nome: string) => void;
};

const AppStoreContext = createContext<AppStoreContextType>({
  noticias: [],
  dbReady: false,
  addNoticia: async () => '',
  updateNoticia: () => {},
  deleteNoticia: () => {},
  getComentarios: () => [],
  addComentario: () => {},
  tags: [],
  addTag: () => {},
  deleteTag: () => {},
  updateTag: () => {},
});

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [comentarios, setComentarios] = useState<Record<string, Comentario[]>>(COMENTARIOS_INICIAL);
  const [tags, setTags] = useState<Tag[]>(TAGS_INICIAL);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    (async () => {
      await initDb();
      const rows = await db.select().from(noticiasTable);
      if (rows.length === 0) {
        await db.insert(noticiasTable).values(NOTICIAS_SEED);
        const seeded = await db.select().from(noticiasTable);
        setNoticias(seeded.map((r) => ({ ...r, id: String(r.id) })));
      } else {
        setNoticias(rows.map((r) => ({ ...r, id: String(r.id) })));
      }
      setDbReady(true);
    })();
  }, []);

  async function addNoticia(n: Omit<Noticia, 'id' | 'leituras' | 'comentarios'>): Promise<string> {
    const [inserted] = await db
      .insert(noticiasTable)
      .values({ ...n, leituras: 0, comentarios: 0 })
      .returning({ id: noticiasTable.id });
    const id = String(inserted.id);
    setNoticias((prev) => [{ ...n, id, leituras: 0, comentarios: 0 }, ...prev]);
    return id;
  }

  function updateNoticia(id: string, changes: Partial<Noticia>) {
    setNoticias((prev) => prev.map((n) => (n.id === id ? { ...n, ...changes } : n)));
    const { titulo, resumo, autor, data, tag, uf, leituras, comentarios, publicada } = changes;
    const fields = { titulo, resumo, autor, data, tag, uf, leituras, comentarios, publicada };
    const clean = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined));
    db.update(noticiasTable).set(clean).where(eq(noticiasTable.id, Number(id))).then(() => {});
  }

  function deleteNoticia(id: string) {
    setNoticias((prev) => prev.filter((n) => n.id !== id));
    db.delete(noticiasTable).where(eq(noticiasTable.id, Number(id))).then(() => {});
  }

  function getComentarios(noticiaId: string): Comentario[] {
    return comentarios[noticiaId] ?? [];
  }

  function addComentario(noticiaId: string, texto: string, autor: string) {
    const novo: Comentario = { id: Date.now(), autor, texto, data: 'agora', curtidas: 0 };
    setComentarios((prev) => ({
      ...prev,
      [noticiaId]: [novo, ...(prev[noticiaId] ?? [])],
    }));
    updateNoticia(noticiaId, {
      comentarios: (noticias.find((n) => n.id === noticiaId)?.comentarios ?? 0) + 1,
    });
  }

  function addTag(nome: string) {
    const cor = CORES_TAG[tags.length % CORES_TAG.length];
    setTags((prev) => [...prev, { id: Date.now(), nome, usos: 0, cor }]);
  }

  function deleteTag(id: number) {
    setTags((prev) => prev.filter((t) => t.id !== id));
  }

  function updateTag(id: number, nome: string) {
    setTags((prev) => prev.map((t) => (t.id === id ? { ...t, nome } : t)));
  }

  return (
    <AppStoreContext.Provider
      value={{
        noticias,
        dbReady,
        addNoticia,
        updateNoticia,
        deleteNoticia,
        getComentarios,
        addComentario,
        tags,
        addTag,
        deleteTag,
        updateTag,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  return useContext(AppStoreContext);
}
