import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from './api';

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
  const [comentarios, setComentarios] = useState<Record<string, Comentario[]>>({});
  const [tags, setTags] = useState<Tag[]>(TAGS_INICIAL);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    api.getNoticias().then((res) => {
      setNoticias(res.data.map((n) => ({ ...n, id: String(n.id) })));
      setDbReady(true);
    });
  }, []);

  async function addNoticia(n: Omit<Noticia, 'id' | 'leituras' | 'comentarios'>): Promise<string> {
    const res = await api.createNoticia(n);
    const nova = { ...res.data, id: String(res.data.id) };
    setNoticias((prev) => [nova, ...prev]);
    return nova.id;
  }

  function updateNoticia(id: string, changes: Partial<Noticia>) {
    setNoticias((prev) => prev.map((n) => (n.id === id ? { ...n, ...changes } : n)));
    api.updateNoticia(id, changes).catch(() => {});
  }

  function deleteNoticia(id: string) {
    setNoticias((prev) => prev.filter((n) => n.id !== id));
    api.deleteNoticia(id).catch(() => {});
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
