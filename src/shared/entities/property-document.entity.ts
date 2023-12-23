import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Property } from "./property.entity";

@Table({ tableName: "propertydocuments" })
export class PropertyDocument extends Model {
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

  @ForeignKey(() => Property)
  @Column({
    type: DataType.INTEGER,
    unique: false,
  })
  propertyId: number;

  @BelongsTo(() => Property, "propertyId")
  Property: Property;
}
