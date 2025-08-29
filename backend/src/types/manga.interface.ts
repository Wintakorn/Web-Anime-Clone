export interface Mangatypes {
    _id: string;
    title: string;
    synopsis: string;
    genre: string[];
    image: string;
    episodes: number;
    releaseDate: Date;
    status: string;
    premiered: string;
    aired: string;
    broadcast: string;
    producers: string[];
    licensors: string[];
    studios: string[];
    source: string;
    demographic: string;
    rating: string;
    score: number;
    ranked: number;
    popularity: number;
    favorites: number;
    mangaSimpleUrl: string;
    price: number;
    discountPercent: number;
    createdAt: string;
    updatedAt: string;
}

export type MangaInput = Omit<Mangatypes, '_id' | 'createdAt' | 'updatedAt'>;
export type MangaUpdate = Partial<MangaInput>;
