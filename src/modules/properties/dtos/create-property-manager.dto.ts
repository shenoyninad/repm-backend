import { IsDateString, IsDefined, IsNotEmpty } from "class-validator";

export class CreatePropertyManagerDto {
  @IsNotEmpty()
  readonly managerId: number;

  @IsDefined()
  @IsNotEmpty()
  @IsDateString()
  readonly startDate: Date;

  @IsDefined()
  @IsNotEmpty()
  @IsDateString()
  readonly endDate: Date;

  @IsNotEmpty()
  readonly activeInd: number;
}
