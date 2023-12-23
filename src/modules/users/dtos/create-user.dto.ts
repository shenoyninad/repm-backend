import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from "class-validator";
import { RoleType } from "@enums/repm.enum";

export class CreateUserDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly firstname: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly lastname: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsPhoneNumber("IN")
  readonly phone: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEnum(RoleType)
  readonly roleType: string;

  @IsDefined()
  @IsNotEmpty()
  @IsBoolean()
  readonly enabled: boolean;
}
