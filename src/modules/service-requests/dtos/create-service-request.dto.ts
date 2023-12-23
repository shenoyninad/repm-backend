import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDefined,
} from "class-validator";
import { RequestType, PriorityType } from "@enums/repm.enum";

export class CreateServiceRequestDto {
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  readonly propertyId: number;

  @IsDefined()
  @IsNotEmpty()
  @IsEnum(RequestType)
  readonly type: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  readonly image: Buffer;

  @IsDefined()
  @IsNotEmpty()
  @IsEnum(PriorityType)
  readonly priority: string;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  readonly raisedById: number;
}
