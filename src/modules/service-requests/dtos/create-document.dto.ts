import { IsDefined, IsNotEmpty, IsNumber } from "class-validator";

export class CreateDocumentDto {
  content: Buffer;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  serviceRequestId: number;
}
