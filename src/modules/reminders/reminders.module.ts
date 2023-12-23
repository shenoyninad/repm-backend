import { Module } from "@nestjs/common";
import { RemindersService } from "./provider/reminders.service";
import { RemindersController } from "./reminders.controller";
import { loggerProvider } from "@providers/logger.provider";
import { DatabaseModule } from "@database/database.module";

@Module({
  imports: [DatabaseModule],
  providers: [RemindersService, loggerProvider],
  controllers: [RemindersController],
  exports: ["Logger"],
})
export class RemindersModule {}
