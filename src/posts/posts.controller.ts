import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';


@Controller('')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('get-posts')
  async getPosts(
    @Query('page') page: number,
    @Query('filter') filterTerm: string | undefined,
  ) {
    if (page && (isNaN(page) || page <= 0)) {
      throw new HttpException('Invalid page value', HttpStatus.BAD_REQUEST);
    }

    const startIndex = (page - 1) * 5;
    const totalPosts = await this.postsService.getPostsCount();
    const posts = await this.postsService.getPosts(startIndex, 5, filterTerm);

    return {
      data: posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPosts / 5), 
      },
    };
  }

  @Get('get-categories')
  async getCategories() {
    return await this.postsService.getCategories();
  }
  @Get('get-tags')
  async getTags() {
    return await this.postsService.getTags();
  }
  
  @Get('get-posts-user')
  @UseGuards(AuthGuard)
  async getPostsByUser(@User() user: UserPrisma, @Query('page') page: number,
  @Query('filter') filterTerm: string | undefined,){
    try {
      if (page && (isNaN(page) || page <= 0)) {
        throw new HttpException('Invalid page value', HttpStatus.BAD_REQUEST);
      }
  
      const startIndex = (page - 1) * 5;
      const totalPosts = await this.postsService.getPostsCountUser(user);
      const posts = await this.postsService.getPostsByUser(user, startIndex, 5, filterTerm);

      return {
        data: posts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalPosts / 5), 
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
  
  @Post('create-post')
  @UseGuards(AuthGuard)
  async createPost(@Body() postDto: CreatePostDto, @User() user: UserPrisma) {
    try {
      console.log(postDto, user)
      return await this.postsService.createPost(user, postDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

}
