import api from "../../service/api";
import type { IComment } from "../../types/comment.t";


export const createComment = (data: {
  content: string;
  postId: string;
  commentImage?: string;
}): Promise<IComment> => {
  return api.post("/comment/create", data).then(res => res.data.newComment);
};


export const fetchCommentsByPost = (postId: string): Promise<IComment[]> => {
  return api.get(`/comments/${postId}`).then(res => res.data.comments);
};

export const updateCommentImage = (
    commentId: string,
    formData: FormData
): Promise<{ commentImage: string }> => {
    return api.put(`/comment/image/${commentId}`, formData).then(res => res.data);
};
