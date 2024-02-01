import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { SignUpDto } from "./dto/signup.dto";
import { SignInDto } from "./dto/signin.dto";
import * as bcrypt from "bcrypt"
import { User } from "@prisma/client";
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService{
    private EXPIRATION_TIME = "7 days";
    private ISSUER = "https://dev-7x5fi3d4qutlv12r.us.auth0.com/";
    private AUDIENCE = "https://blog-app-api.com";

    constructor(private readonly jwtService: JwtService,
        private readonly userService: UsersService){}

    async signUp(signUpDto: SignUpDto) {
        return await this.userService.create(signUpDto);
      }

    async signIn(signInDto: SignInDto){
        const {userName, password} = signInDto;
        const user = await this.userService.getUserByUsername(userName);
        if (!user) throw new UnauthorizedException("Email or password not valid.");

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new UnauthorizedException("Email or password not valid.");
        return this.createToken(user);
      }

    
    createToken(user: User){
        const { id, userName } = user;
   

    const token = this.jwtService.sign({ userName }, { 
      expiresIn: this.EXPIRATION_TIME, 
      subject: String(id), 
      issuer: this.ISSUER, 
      audience: this.AUDIENCE 
    })

    return { token, userName };
    }

    checkToken(token: string){
        const data = this.jwtService.verify(token, {
            audience: this.AUDIENCE,
            issuer: this.ISSUER
          });
          return data;
    }


}