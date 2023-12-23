import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { getConfig } from "@utils/configUtils";
@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  private privateKey: string;

  constructor() {
    const config = getConfig();
    this.privateKey = config.http.authToken;
  }

  use(req: Request, res: Response, next: NextFunction) {
    const key = req.headers["x-api-key"];

    if (key === this.privateKey) {
      next();
    } else {
      throw new HttpException("Invalid key", HttpStatus.FORBIDDEN);
    }
  }
}
