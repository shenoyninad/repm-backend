import { PropertyType } from "@enums/repm.enum";
import { IsString, IsNotEmpty, IsEnum, IsDefined } from "class-validator";

export class CreatePropertyDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(PropertyType)
  readonly type: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  readonly pincode: string;

  @IsDefined()
  @IsNotEmpty()
  readonly image: Buffer;

  @IsNotEmpty()
  readonly ownerId: number;
}
