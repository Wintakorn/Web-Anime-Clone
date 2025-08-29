import api from "../service/api";
import type { CartItem } from "../types/cart.t";


export const addToCart = (item: CartItem) =>
    api.post('/cart', item);

export const fetchCart = () =>  
    api.get(`/cart`).then(res => res.data.items);

export const removeCartItem = (mangaId: string) =>
    api.delete(`/cart/${mangaId}`);

export const updateCartItem = (mangaId: string, quantity: number) =>
    api.put(`/cart/${mangaId}`, { quantity });
