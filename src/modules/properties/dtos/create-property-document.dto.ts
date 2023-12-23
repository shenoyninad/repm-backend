import { IsDefined, IsNotEmpty, IsNumber } from "class-validator";

export class CreatePropertyDocumentDto {
  content: Buffer;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  propertyId: number;
}
