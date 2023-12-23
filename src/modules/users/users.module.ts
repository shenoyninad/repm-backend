import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./provider/users.service";
import { DatabaseModule } from "@database/database.module";
import { loggerProvider } from "@providers/logger.provider";

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService, loggerProvider],
  exports: ["Logger"],
})
export class UsersModule {
  /* add code here */
}
