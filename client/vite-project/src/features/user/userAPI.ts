import api from '../../service/api';
import type { Manga } from '../../types/manga.t';
import type { LoginInput, LoginResponse, User, UserInput } from '../../types/user.t';

export const registerUser = (data: UserInput) =>
  api.post('/user/register', data);

export const favorite = (id: string) =>
  api.put(`/favorite/${id}`)

export const fetchUserFavorites = (): Promise<Manga[]> =>
  api.get('/user/favorites').then(res => res.data.favorites);

export const loginUser = (data: LoginInput): Promise<LoginResponse> =>
  api.post('/user/login', data).then(res => res.data);


export const fetchUsers = (): Promise<User[]> =>
  api.get('/users').then(res => res.data.users);


export const fetchUserById = (id: string): Promise<User> =>
  api.get(`/users/${id}`).then(res => res.data.user);


export const updateUser = (id: string, data: Partial<User>) =>
  api.put(`/user/${id}`, data);


export const deleteUser = (id: string) =>
  api.delete(`/user/${id}`);

export const getCurrentUser = (): Promise<User> =>
  api.get('/user/me').then(res => res.data);

export const updateProfileImage = (formData: FormData): Promise<{ profileImage: string }> => {
  return api.patch('/user/profile-image', formData).then(res => res.data);
};
