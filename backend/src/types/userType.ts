export interface Usertype {
    _id: string;
    username: string;
    email: string;
    role: 'buyer' | 'seller' | 'admin';
    avatar?: string;
    address?: string;
    phone?: string;
    createdAt: string;
    updatedAt: string;
}


export type UserRegisterInput = Pick<Usertype, 'username' | 'email'> & { password: string };


export type LoginInput = { username: string; password: string };


export type UserUpdateInput = Partial<Omit<Usertype, '_id' | 'createdAt' | 'updatedAt'>> & {
  password?: string;
};
