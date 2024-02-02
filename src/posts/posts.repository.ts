import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto/create-post.dto';
import { User } from '@prisma/client';

@Injectable()
export class PostsRepository {
 
  constructor(private readonly prisma: PrismaService) {}
  
  deletePost(id: number) {
    return this.prisma.post.delete({
      where: {id},
    })
  }

  updatePost(id: number, body: UpdatePostDto) {
    return this.prisma.post.update({
      where: {id},
      data: {
        title: body.title,
        description: body.description
      }
    })
  }
  
  getPostsCount() {
    return this.prisma.post.count({});
  }
  getPostsCountUser(id: any) {
    return this.prisma.post.count({
      where: {
        userId: id
      }
    });
  }

  getTags() {
    return this.prisma.tag.findMany();
  }
  getCategories() {
    return this.prisma.category.findMany();
  }
  getPosts(skip: number, take: number, filterTerm: string | undefined) {
    return this.prisma.post.findMany({
      where: filterTerm
        ? {
            OR: [{ title: { contains: filterTerm, mode: 'insensitive' } }, { description: { contains: filterTerm, mode: 'insensitive' } }],
          }
        : {},
      skip,
      take,
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        user: {
          select: {
            userName: true,
            id: true
          }
        },
        category: {
          select: {
            name: true,
            id: true
          }
        },
        tag: {
          select: {
            name: true,
            id: true
          }
        }
      }
    });
  }

  getPostsByUser(id: number, skip: number, take: number, filterTerm: string | undefined) {
    return this.prisma.post.findMany({
      where: {
        AND: [
          filterTerm
            ? {
                OR: [
                  { title: { contains: filterTerm, mode: 'insensitive' } },
                  { description: { contains: filterTerm, mode: 'insensitive' } },
                ],
              }
            : {},
          {
            userId: id, 
          },
        ],
      },
      skip,
      take,
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        user: {
          select: {
            userName: true,
            id: true,
          },
        },
        category: {
          select: {
            name: true,
            id: true,
          },
        },
        tag: {
          select: {
            name: true,
            id: true,
          },
        },
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
          connect: {
            id: catId,
          },
        },
      },
    });
  }

  createTag(tagName: string) {
    return this.prisma.tag.create({
      data: {
        name: tagName,
      },
    });
  }

  createCat(categoryName: string) {
    return this.prisma.category.create({
      data: {
        name: categoryName,
      },
    });
  }
}
