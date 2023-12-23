import { Injectable } from "@nestjs/common";
import { buildGuardRoutes } from "@utils/configUtils";

@Injectable()
export class AppService {
  constructor() {
    /* add code here */
  }
  startRepm(): string {
    return "Hello World!";
  }
}
