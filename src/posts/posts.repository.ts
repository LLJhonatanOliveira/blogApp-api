import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '@prisma/client';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}
  getPostsCount() {
    return this.prisma.post.count({});
  }

  getPosts(skip: number, take: number, filterTerm: string | undefined) {
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
    });
  }

  getTag(tag: string) {
    return this.prisma.tag.findUnique({
      where: { name: tag },
    });
  }

  getCategory(category: string) {
    return this.prisma.category.findUnique({
      where: { name: category },
    });
  }

  createPost(user: User, postDto: CreatePostDto, catId: number, tagId: number) {
    return this.prisma.post.create({
      data: {
        description: postDto.description,
        title: postDto.title,
        image: postDto.image,
        user: {
          connect: user,
        },
        tag: {
          connect: {
            id: tagId,
          },
        },
        category: {
          connect:{
            id: catId,
          }
        },
      },
    });
  }

  createTag(tagName: string) {
    return  this.prisma.tag.create({
      data: {
        name: tagName
      }
    })
  }
  createCat(categoryName: string) {
    return  this.prisma.category.create({
      data: {
        name: categoryName
      }
    })
  }
}
