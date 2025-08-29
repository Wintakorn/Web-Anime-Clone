import api from '../../service/api';
import type { Manga, MangaQuery, MangaResponse } from '../../types/manga.t';


export const fetchMangaseach = (query: MangaQuery): Promise<MangaResponse> =>
  api.get('/mangas', { params: query }).then(res => res.data);

// export const fetchMangas = (): Promise<Manga[]> =>
//   api.get('/mangas').then(res => res.data.mangas);

export const fetchMangas = (): Promise<Manga[]> =>
  api.get('/mangas').then(res => {
    console.log('📦 Full Response:', res);
    return res.data.mangas;
  });



export const fetchMangaById = (id: string): Promise<Manga> =>
  api.get(`/manga/${id}`).then(res => res.data.manga); 

export const createManga = (data: Partial<Manga>) =>
  api.post('/manga/create', data);

export const updateManga = (id: string, data: Partial<Manga>) =>
  api.put(`/manga/update/${id}`, data);

export const deleteManga = (id: string) =>
  api.delete(`/manga/delete/${id}`);

