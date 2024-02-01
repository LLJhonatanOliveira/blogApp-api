import { IsDateString, IsNotEmpty, IsString, IsStrongPassword, IsUrl } from "class-validator";

export default class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    sex: string;

    @IsDateString()
    @IsNotEmpty()
    birth: string;
    
    @IsNotEmpty()
    @IsString()
    userName: string;
  
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;
  }
  