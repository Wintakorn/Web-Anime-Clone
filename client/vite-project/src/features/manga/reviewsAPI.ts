import api from '../../service/api';
import type { ReviewInput, ReviewItem } from '../../types/review.t';


export const fetchReviews = (): Promise<ReviewItem[]> =>
    api.get('/reviews').then(res => res.data);

export const createReview = (data: ReviewInput): Promise<ReviewItem> => {
    return api.post('/reviews', data).then(res => res.data);
};

export const likeReview = (id: string): Promise<{ likes: number; liked: boolean }> => {
    return api.patch(`/reviews/${id}/like/`, null,).then(res => res.data);
};

export const fetchReviewsByManga = (mangaId: string): Promise<ReviewItem[]> =>
    api.get(`/reviews?mangaId=${mangaId}`).then(res => res.data);

export const deleteReview = (id: string): Promise<void> => {
    return api.delete(`/reviews/${id}`).then((res) => res.data);
}