import { Category, Tag, User } from "@prisma/client";

export interface PostInterface {
    id: number;
    image: string;
    title: string;
    description: string;
    user: User;
    category?: Category;
    tag?: Tag;
}