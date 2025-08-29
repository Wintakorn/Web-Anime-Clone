export interface IPost {
  id: string;
  title: string;
  postImage: string;
  postContent: string;
  categories: string[];
  createdAt: string;
  updatedAt: string;
  commentCount?: number;
  user: {
    _id: string;
    name: string;
    role: string;
    avatar: string;
    tagPerson: string[];
  };
}


export interface PostInput {
  title: string;
  postContent: string;
  postImage?: string;
  categories: string[];
}