export interface IReplys {
    id: string;
    content: string;
    contentImage: string;
    createdAt: string;
    updatedAt: string;
    user: {
        _id: string;
        name: string;
        avatar?: string;
    };
}

export interface ReplyInput {
    commentId: string;
    content: string;
    contentImage?: string;
}