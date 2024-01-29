import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { SignUpDto } from "./dto/signup.dto";
import { SignInDto } from "./dto/signin.dto";
import * as bcrypt from "bcrypt"
import { User } from "@prisma/client";
@Injectable()
export class AuthService{
    constructor(private readonly userService: UsersService){}

    async signUp(signUpDto: SignUpDto) {
        return await this.userService.create(signUpDto);
      }

    async signIn(signInDto: SignInDto){
        const {userName, password} = signInDto;
        const user = await this.userService.getUserByUsername(userName);
    if (!user) throw new UnauthorizedException("Email or password not valid.");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException("Email or password not valid.");
    }

    
    createToken(user: User){
        //TODO (pegar token usando jwt)
    }

    checkToken(token: string){
        //Validar usando Auth0
    }


}