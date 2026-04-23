import axios from 'axios';
import { Noticia } from './appStore';

// Em dispositivo físico, troque pelo IP da sua máquina (ex: http://192.168.0.10:3000)
const BASE_URL = 'http://localhost:3000';

const http = axios.create({ baseURL: BASE_URL });

export const api = {
  getNoticias: () => http.get<Noticia[]>('/noticias'),
  getNoticia: (id: string) => http.get<Noticia>(`/noticias/${id}`),
  createNoticia: (data: Omit<Noticia, 'id' | 'leituras' | 'comentarios'>) =>
    http.post<Noticia>('/noticias', data),
  updateNoticia: (id: string, data: Partial<Noticia>) =>
    http.put<Noticia>(`/noticias/${id}`, data),
  deleteNoticia: (id: string) => http.delete(`/noticias/${id}`),
};
