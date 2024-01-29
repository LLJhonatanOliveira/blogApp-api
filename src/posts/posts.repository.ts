import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PostsRepository{
    constructor(private readonly prisma: PrismaService){}
    getPostsCount(){
        return this.prisma.post.count({});
    }

    getPosts(skip: number, take: number, filterTerm: string | undefined){
        return this.prisma.post.findMany({
            where: filterTerm
        ? {
            OR: [{ title: { contains: filterTerm, mode: 'insensitive' } }],
          }
        : {},
      skip,
      take,
      orderBy: {
        id: 'asc',
      },
        })
    }

    
}
