import { ReminderStatus } from "@enums/repm.enum";
import {
  IsDateString,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";

export class CreateReminderDto {
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  readonly sender: number;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  readonly receiver: number;

  @IsDefined()
  @IsNotEmpty()
  @IsDateString()
  readonly startDate: Date;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly message: string;
}
