import { ServiceRequestStatus } from "@enums/repm.enum";
import { IsEnum } from "class-validator";

export class UpdateServiceRequestDto {
  readonly feedback: string;

  readonly rating: number;

  @IsEnum(ServiceRequestStatus)
  readonly status: string;
}
