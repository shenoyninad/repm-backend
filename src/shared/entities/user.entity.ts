import { RoleType } from "@enums/repm.enum";
import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "users" })
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  userId: number;

  @Column({
    type: DataType.STRING,
    unique: false,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    unique: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    unique: false,
  })
  firstname: string;

  @Column({
    type: DataType.STRING,
    unique: false,
  })
  lastname: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    unique: false,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    unique: false,
  })
  roleType: RoleType;

  @Column({
    type: DataType.BOOLEAN,
    unique: false,
  })
  enabled: boolean;
}
