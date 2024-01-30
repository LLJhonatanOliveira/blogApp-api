import { Category, Tag } from "@prisma/client";
import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreatePostDto {
    @IsNotEmpty()
    @IsUrl()
    image: string;
    @IsNotEmpty()
    @IsString()
    title: string;
    @IsString()
    @IsNotEmpty()
    description: string;
    @IsString()
    category?: string;
    @IsString()
    tag?: string;
}
