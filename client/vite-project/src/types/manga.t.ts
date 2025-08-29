export interface Manga {
  _id: string;
  title: string;
  synopsis: string;
  genre: string[];
  image: string;
  score: number;
  releaseDate: string;
  status: string;
  price: number;
  discountPercent: number;
  episodes: number;
  premiered: string;
  aired: string;
  broadcast: string;
  producers: string[];
  licensors: string[];
  studios: string[];
  source: string;
  demographic: string;
  rating: string;
  ranked: number;
  popularity: number;
  favorites: number;
  animeSimpleUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type MangaQuery = {
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
};

export type MangaResponse = {
  mangas: Manga[];
  total: number;
  page: number;
  totalPages: number;
};

export interface Category {
  name: string;
  color: string;
}
