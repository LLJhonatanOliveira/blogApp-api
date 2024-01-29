import { Injectable } from '@nestjs/common';
import { PostInterface } from './interfaces/posts.interface';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
    constructor(private readonly repository: PostsRepository) {}
    async getPostsCount() {
        return await this.repository.getPostsCount()
    }
    async getPosts(skip: number,take: number, filterTerm: string | undefined){
        let posts: PostInterface[] = [];
       return await this.repository.getPosts(skip, take, filterTerm)
    }
}
