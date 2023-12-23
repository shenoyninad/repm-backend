import { RequestLogType } from "@enums/repm.enum";
import {
  IsEnum,
  IsNotEmpty,
  IsDefined,
  IsNumber,
  IsString,
  IsDateString,
} from "class-validator";

export class CreateServiceRequestLogDto {
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(RequestLogType)
  readonly type: string;

  @IsDefined()
  @IsNotEmpty()
  @IsDateString()
  readonly startDate: Date;

  @IsDefined()
  @IsNotEmpty()
  @IsDateString()
  readonly endDate: Date;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly description: string;
}
