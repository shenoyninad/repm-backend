import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./user.entity";
import { Property } from "./property.entity";
import { PropertyManagerAssignment } from "@enums/repm.enum";

@Table({ tableName: "propertymanagers" })
export class PropertyManager extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  ID: number;

  @ForeignKey(() => Property)
  @Column({ type: DataType.INTEGER, field: "propertyId" })
  propertyId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, field: "managerId" })
  managerId: number;

  @Column(DataType.DATE)
  startDate: Date;

  @Column(DataType.DATE)
  endDate: Date;

  @Column({ type: DataType.INTEGER, unique: false })
  activeInd: PropertyManagerAssignment;

  @BelongsTo(() => Property, "propertyId")
  Property: Property;

  @BelongsTo(() => User, "managerId")
  Manager: User;
}
