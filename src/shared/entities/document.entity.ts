import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { ServiceRequest } from "./service-request.entity";

@Table({ tableName: "documents" })
export class Document extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  ID: number;

  @Column({
    type: DataType.STRING,
    unique: false,
  })
  name: string;

  @Column({
    type: DataType.BLOB("medium"),
    unique: false,
  })
  content: Buffer;

  @ForeignKey(() => ServiceRequest)
  @Column({
    type: DataType.INTEGER,
    unique: false,
  })
  serviceRequestId: number;

  @BelongsTo(() => ServiceRequest, "serviceRequestId")
  ServiceRequest: ServiceRequest;
}
