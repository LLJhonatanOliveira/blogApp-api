import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { UsersModule } from 'src/users/users.module';
import { PostsRepository } from './posts.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule],
  providers: [PostsService, PostsRepository],
  controllers: [PostsController]
})
export class PostsModule {}
