export interface IMessage {
    id: string;
    isRead: boolean;
    title: string;
    content: string;
    image?: string;
    author: string | IAuthor;
    createdAt: number;
    hasAttachment: boolean;
    attachment?: {
        name: string;
        sizeBytes: number;
        url: string;
    };
    preview: string;
}

export interface IAuthor {
    id: string;
    name: string;
    avatar: string;
}

