import { Injectable } from "@nestjs/common";
import CreateUserDto from "./dto/create-user.dto";
import * as bcrypt from "bcrypt"
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersRepository {

  private SALT = 10;
  constructor(private readonly prisma: PrismaService) { }

  create(userDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        ...userDto,
        password: bcrypt.hashSync(userDto.password, this.SALT)
      }
    })
  }

  getById(id: number) {
    return this.prisma.user.findUnique({
      where: { id }
    })
  }

  getUserByUsername(userName: string) {
    return this.prisma.user.findFirst({
      where: { userName }
    })
  }

}
