export interface Product {
    _id: string;
    mangaId: string; 
    sellerId: string; 
    price: number;
    condition: 'new' | 'used-like-new' | 'used-good' | 'used-fair'; // สภาพสินค้า
    stock: number;
    images: string[]; 
    language: 'JP' | 'EN' | 'TH' | string;
    format: 'physical' | 'digital';
    description: string;
    createdAt: string;
    updatedAt: string;
}
