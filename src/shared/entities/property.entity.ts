import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  HasOne,
  HasMany,
} from "sequelize-typescript";
import { User } from "./user.entity";
import { PropertyType } from "@enums/repm.enum";
import { PropertyManager } from "./property-manager.entity";
import { ServiceRequest } from "./service-request.entity";

@Table({ tableName: "properties" })
export class Property extends Model {
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
  type: PropertyType;

  @Column({
    type: DataType.STRING,
    unique: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    unique: false,
  })
  address: string;

  @Column({
    type: DataType.STRING,
    unique: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    unique: false,
  })
  pincode: string;

  @Column({
    type: DataType.BLOB("medium"),
    unique: false,
  })
  image: Buffer;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: "ownerId",
  })
  ownerId: number;

  @BelongsTo(() => User, "ownerId")
  Owner: User;

  @HasOne(() => PropertyManager, "propertyId")
  PropertyManager: PropertyManager;

  @HasMany(() => ServiceRequest, "propertyId")
  ServiceRequests: ServiceRequest[];
}
