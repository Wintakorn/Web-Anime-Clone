export interface User {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
  image: string;
  comment: string;
  likes: number;
  favorites: string[];
  aboutMe?: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface UserInput {
  username: string;
  password: string;
  email: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  username: string;
  profileImage?: string;
  image?: string;
}
