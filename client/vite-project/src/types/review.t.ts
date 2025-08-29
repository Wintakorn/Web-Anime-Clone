export interface Review {
  id: number;
  name: string;
  avatar?: string;
  comment: string;
  rating: number;
  time: string;
  likes: number;
}
export interface ReviewInput {
  comment: string;
  rating: number;
  mangaId: string;
}

export interface ReviewItem {
  id: string;
  comment: string;
  rating: number;
  createdAt: string;
  likes: number;
  user: {
    name: string;
    avatar: string;
    _id: string;
    role: string;
    tagPerson: string[];
  };
  book_manga:{
    _id: string,
    title: string,
    image: string,
    genre: string[];
  }
  likedBy?: string[];
  mangaId?: string;
}
