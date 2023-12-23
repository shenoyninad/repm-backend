import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    /* add code here */
  }

  @Get()
  getHello(): string {
    return this.appService.startRepm();
  }
}
