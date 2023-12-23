import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "@users/users.module";
import { buildGuardRoutes } from "@utils/configUtils";
import { ApiKeyMiddleware } from "api-key/api-key.middleware";
import { ServiceRequestsModule } from "@serviceRequest/service-requests.module";
import { PropertiesModule } from "@properties/properties.module";
import { RemindersModule } from "@reminders/reminders.module";

@Module({
  imports: [UsersModule, ServiceRequestsModule, PropertiesModule, RemindersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const routes = buildGuardRoutes();

    routes.forEach((route) => {
      consumer.apply(ApiKeyMiddleware).forRoutes(route);
    });
  }
}
