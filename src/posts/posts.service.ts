import { Injectable } from '@nestjs/common';
import { PostInterface } from './interfaces/posts.interface';
import { PostsRepository } from './posts.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { Category, Tag, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  
 
  
 
  constructor(
    private readonly repository: PostsRepository,
    private readonly prisma: PrismaService,
  ) {}
  async getPostsByUser(user: User, skip: number, take: number, filterTerm: string | undefined) {
    return await this.repository.getPostsByUser(user.id, skip, take, filterTerm)
  }

  async getCategories() {
    return await this.repository.getCategories();
  }
  
  async getTags() {
    return await this.repository.getTags();
  }

  async getPostsCount() {
    return await this.repository.getPostsCount();
  }
  async getPostsCountUser(user) {
    return await this.repository.getPostsCountUser(user.id);
  }

  async getPosts(skip: number, take: number, filterTerm: string | undefined) {
    return await this.repository.getPosts(skip, take, filterTerm);
  }

  async createPost(user: User, postDto: CreatePostDto) {
    return this.prisma.$transaction(async (prisma) => {
      let cat: Category;
      let tag: Tag;
      if (postDto.category) {
        let searchCat = await this.repository.getCategory(postDto.category);
        if (!searchCat) {
          cat = await this.repository.createCat(postDto.category);
        } else {
          cat = searchCat;
        }
      }

      if (postDto.tag) {
        let searchTag = await this.repository.getTag(postDto.tag);
        if (!searchTag) {
          tag = await this.repository.createTag(postDto.tag);
        } else {
          tag = searchTag;
        }
      }

      return this.repository.createPost(user, postDto, cat.id, tag.id);
    });
  }
}
