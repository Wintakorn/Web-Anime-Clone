export interface IComment {
  id: string;
  content: string;
  commentImage?: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
    role: string;
  };
}
