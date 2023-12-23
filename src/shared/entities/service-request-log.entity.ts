import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { RequestLogType } from "@enums/repm.enum";
import { ServiceRequest } from "./service-request.entity";

@Table({ tableName: "servicerequestlogs" })
export class ServiceRequestLog extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  ID: number;

  @ForeignKey(() => ServiceRequest)
  @Column({
    type: DataType.INTEGER,
    unique: false,
  })
  serviceRequestId: number;

  @Column({
    type: DataType.STRING,
    unique: false,
  })
  type: RequestLogType;

  @Column({
    type: DataType.DATE,
    unique: false,
  })
  startDate: Date;

  @Column({
    type: DataType.DATE,
    unique: false,
  })
  endDate: Date;

  @Column({
    type: DataType.FLOAT,
    unique: false,
  })
  price: number;

  @Column({
    type: DataType.STRING,
    unique: false,
  })
  description: string;

  @BelongsTo(() => ServiceRequest, "serviceRequestId")
  ServiceRequest: ServiceRequest;
}
