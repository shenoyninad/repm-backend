import { Injectable } from "@nestjs/common";
import { Reminder } from "@entities/reminder.entity";
import { CreateReminderDto } from "modules/reminders/dtos/create-reminder.dto";
import { ReminderStatus } from "@enums/repm.enum";

@Injectable()
export class RemindersService {
  constructor() {}

  async createReminder(createReminderDto: CreateReminderDto): Promise<any> {
    const reminder = await Reminder.create({
      status: ReminderStatus.SENT,
      ...createReminderDto,
    });
    return reminder;
  }

  async getReminders(receiver: number): Promise<Reminder[]> {
    const reminders = await Reminder.findAll({
      where: { receiver },
    });
    return reminders;
  }
}
