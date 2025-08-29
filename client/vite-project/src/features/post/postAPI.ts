import api from "../../service/api";
import type { IPost, PostInput } from "../../types/post.t";

export const fetchPosts = (): Promise<IPost[]> => {
    return api.get('/posts').then(res => res.data.posts);
};

export const fetchPostById = (id: string): Promise<IPost> => {
    return api.get(`/post/${id}`).then(res => res.data.post);
};

export const createPost = (postData: PostInput): Promise<IPost> => {
    return api.post('/post/create', postData, {
    }).then(res => res.data.newPost);
};

export const updatePost = (id: string, postData: Partial<IPost>): Promise<IPost> => {
    return api.put(`/post/update/${id}`, postData, {
    }).then(res => res.data.updatePost);
};

export const deletePost = (id: string): Promise<void> => {
    return api.delete(`/post/delete/${id}`, {
    }).then();
};

export const updatePostImage = (
    postId: string,
    formData: FormData
): Promise<{ postImage: string }> => {
    return api.put(`/post/image/${postId}`, formData).then(res => res.data);
};
