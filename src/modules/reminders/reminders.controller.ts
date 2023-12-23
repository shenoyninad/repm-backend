import {
  Controller,
  Post,
  Get,
  Body,
  BadRequestException,
  Res,
  Param,
  HttpStatus,
  Inject,
} from "@nestjs/common";
import { RemindersService } from "./provider/reminders.service";
import { CreateReminderDto } from "./dtos/create-reminder.dto";
import { Response } from "express";

@Controller("reminders")
export class RemindersController {
  constructor(
    private readonly remindersService: RemindersService,
    @Inject("Logger") private readonly logger,
  ) {}

  @Post()
  async createReminder(
    @Body() createReminderDto: CreateReminderDto,
  ): Promise<any> {
    try {
      this.logger.info(
        `Creating reminder by owner Id ${createReminderDto.sender}`,
      );
      const reminder =
        await this.remindersService.createReminder(createReminderDto);

      if (!reminder) {
        throw new BadRequestException("Failed to create reminder");
      }

      return reminder;
    } catch (error) {
      this.logger.info(
        `Failed to create reminder by owner Id ${createReminderDto.sender}`,
      );
      throw new BadRequestException("Failed to create reminder");
    }
  }

  @Get(":id")
  async getReminders(
    @Param("id") receiverId: number,
    @Res() response: Response,
  ): Promise<any> {
    try {
      this.logger.info(`fetching reminders by manager Id ${receiverId}`);
      const reminders = await this.remindersService.getReminders(receiverId);

      if (!reminders) {
        this.logger.info(`Reminders not found for manager Id ${receiverId}`);
        throw new BadRequestException("Reminders not found");
      }
      return response.status(HttpStatus.OK).json(reminders);
    } catch (error) {
      this.logger.info(`Error fetching reminders for manager Id ${receiverId}`);
      throw new BadRequestException("Reminders could not be fetched");
    }
  }
}
