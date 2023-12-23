import { Module } from "@nestjs/common";
import { DatabaseModule } from "@database/database.module";
import { ServiceRequestsController } from "./service-requests.controller";
import { loggerProvider } from "@providers/logger.provider";
import { ServiceRequestsService } from "./provider/service-requests.service";

@Module({
  imports: [DatabaseModule],
  providers: [ServiceRequestsService, loggerProvider],
  controllers: [ServiceRequestsController],
  exports: ["Logger"],
})
export class ServiceRequestsModule {}
