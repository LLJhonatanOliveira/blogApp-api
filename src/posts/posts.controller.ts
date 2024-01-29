import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';

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
    const posts = await this.postsService.getPosts(startIndex,5, filterTerm);

    return {
        data: posts,
        pagination: {
            currentPage: page,
            totalPages:Math.ceil(totalPosts/5)
        }
    }
  }
}
