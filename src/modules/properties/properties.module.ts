import { Module } from "@nestjs/common";
import { PropertiesService } from "./provider/properties.service";
import { PropertiesController } from "./properties.controller";
import { loggerProvider } from "@providers/logger.provider";
import { DatabaseModule } from "@database/database.module";

@Module({
  imports: [DatabaseModule],
  providers: [PropertiesService, loggerProvider],
  controllers: [PropertiesController],
  exports: ["Logger"],
})
export class PropertiesModule {}
