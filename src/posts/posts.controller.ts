import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';

@Controller('')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Get('get-posts')
  async getPosts(@Query('page') page: number = undefined,
  @Query('filter') filterTerm: string | undefined) {

    if (page && (isNaN(page) || page <= 0)) {
      throw new HttpException('Invalid page value', HttpStatus.BAD_REQUEST);
    }

    const startIndex = (page-1)*5;
    const totalPosts = await this.postsService.getPostsCount();
    const posts = await this.postsService.getPosts(startIndex, 5, filterTerm);

    return {
        data: posts,
        pagination: {
            currentPage: page,
            totalPages:Math.ceil(totalPosts/5)
        }
    }
  }

  @Post('create-post')
  async createPost(@Body() postDto: CreatePostDto, @User() user: UserPrisma){
    try {
      return await this.postsService.createPost(user, postDto)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED)
    }
  }
}
