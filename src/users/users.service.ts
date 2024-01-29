import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { UsersRepository } from './users.repository';
import CreateUserDto from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) { }
  async create(userDto: CreateUserDto) {
    const { userName } = userDto;
    const user = await this.usersRepository.getUserByUsername(userName);
    if (user) throw new ConflictException("Username already in use.");

    return await this.usersRepository.create(userDto);
  }

  async getById(id: number) {
    const user = await this.usersRepository.getById(id);
    if (!user) throw new NotFoundException("User not found!");

    return user;
  }

  async getUserByUsername(userName: string) {
    return await this.usersRepository.getUserByUsername(userName);
  }
}
