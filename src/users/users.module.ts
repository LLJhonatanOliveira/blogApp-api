import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

@Module({
  controllers: [],
  providers: [UsersService, UsersRepository],
  exports: [UsersService]
})
export class UsersModule {}
