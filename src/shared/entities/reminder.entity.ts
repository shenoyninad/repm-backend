import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { ReminderStatus } from "@enums/repm.enum";
import { User } from "./user.entity";

@Table({ tableName: "reminders" })
export class Reminder extends Model<Reminder> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  ID: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    unique: false,
  })
  sender: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    unique: false,
  })
  receiver: number;

  @Column({
    type: DataType.DATE,
    unique: false,
  })
  startDate: Date;

  @Column({
    type: DataType.STRING,
    unique: false,
  })
  message: string;

  @Column({
    type: DataType.STRING,
    unique: false,
  })
  status: ReminderStatus;

  @BelongsTo(() => User, "sender")
  SenderUser: User;

  @BelongsTo(() => User, "receiver")
  ReceiverUser: User;
}
