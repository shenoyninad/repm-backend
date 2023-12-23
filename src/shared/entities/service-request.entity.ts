import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import {
  RequestType,
  PriorityType,
  ServiceRequestStatus,
} from "@enums/repm.enum";
import { Document } from "./document.entity";
import { Property } from "./property.entity";
import { ServiceRequestLog } from "./service-request-log.entity";
import { User } from "./user.entity";

@Table({ tableName: "servicerequests" })
export class ServiceRequest extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  ID: number;

  @ForeignKey(() => Property)
  @Column({
    type: DataType.INTEGER,
    unique: false,
  })
  propertyId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    unique: false,
  })
  raisedById: number;

  @Column({
    type: DataType.STRING,
    unique: false,
  })
  type: RequestType;

  @Column({
    type: DataType.DATE,
    unique: false,
  })
  requestDate: Date;

  @Column({
    type: DataType.STRING,
    unique: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    unique: false,
  })
  feedback: string;

  @Column({
    type: DataType.STRING,
    unique: false,
  })
  status: ServiceRequestStatus;

  @Column({
    type: DataType.STRING,
    unique: false,
  })
  priority: PriorityType;

  @Column({
    type: DataType.INTEGER,
    unique: false,
  })
  rating: number;

  @Column({
    type: DataType.BLOB("medium"),
    unique: false,
  })
  image: Buffer;

  @BelongsTo(() => User, "raisedById")
  User: User;

  @BelongsTo(() => Property, "propertyId")
  Property: Property;

  @HasMany(() => ServiceRequestLog, "serviceRequestId")
  ServiceRequestLogs: ServiceRequestLog[];

  @HasMany(() => Document, "serviceRequestId")
  Documents: Document[];
}
