export interface Order {
    _id: string;
    buyerId: string;
    items: {
        productId: string;
        quantity: number;
        priceAtPurchase: number;
    }[];
    totalAmount: number;
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: string;
    createdAt: string;
    updatedAt: string;
}
