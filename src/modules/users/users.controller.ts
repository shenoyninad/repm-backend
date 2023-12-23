import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  Res,
  HttpStatus,
  Query,
  Inject,
  Param,
} from "@nestjs/common";
import { UsersService } from "./provider/users.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Response } from "express";
import * as bcrypt from "bcrypt";
import { User } from "@entities/user.entity";
import { Constants } from "@utils/constants";

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject("Logger") private readonly logger,
  ) {
    /* add constructor code here */
  }
  @Post("login")
  async login(
    @Body("email") email: string,
    @Body("password") password: string,
    @Res() response: Response,
  ): Promise<any> {
    try {
      this.logger.info(`Logging in the user: ${email}`);
      const loggedInUser: User = await this.usersService.userLogin(email);
      if (!loggedInUser) {
        this.logger.info(`Login failed for user: ${email} Invaild email `);
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .send({ code: Constants.USER_INVALID, message: "Invalid user" });
      }
      const passwordMatch = await bcrypt.compare(
        password,
        loggedInUser.password,
      );
      if (!passwordMatch) {
        this.logger.info(`Login failed for user: ${email} Invaild password `);
        return response.status(HttpStatus.UNAUTHORIZED).send({
          code: Constants.USER_PASSWORD_INVALID,
          message: "Incorrect password",
        });
      }
      return response.status(HttpStatus.OK).send(loggedInUser);
    } catch (error) {
      this.logger.info(`Login failed for user: ${email}`);
      throw new BadRequestException("Login failed");
    }
  }

  @Post("register")
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ): Promise<any> {
    const user = plainToClass(CreateUserDto, createUserDto);
    const errors = await validate(user);

    if (errors.length > 0) {
      this.logger.info(
        `Failed Registering up the user: ${createUserDto.username} : Validation error`,
      );
      throw new BadRequestException(errors);
    }

    try {
      this.logger.info(`Registering up the user: ${createUserDto.username}`);
      const createdUser: User =
        await this.usersService.registerUser(createUserDto);
      return response.status(HttpStatus.CREATED).send(createdUser);
    } catch (error) {
      this.logger.info(
        `Failed Registering up the user: ${createUserDto.username}`,
      );
      throw new BadRequestException(error);
    }
  }

  @Get(":id")
  async findUserid(@Param("id") userId: number, @Res() response: Response) {
    if (userId == 0) {
      this.logger.info(`No such user exists by user ID: ${userId}`);
      throw new BadRequestException("No such user exists");
    }

    try {
      this.logger.info(`Looking up the user: ${userId}`);
      const user: any = await this.usersService.findUser(userId);
      if (!user) {
        throw new BadRequestException("User not found");
      }
      return response.status(HttpStatus.OK).send(user);
    } catch (error) {
      this.logger.info(`User details could not be fetched for Id: ${userId}`);
      throw new BadRequestException("User details could not be fetched");
    }
  }

  @Get("")
  async findUserByEmail(
    @Query("email") email: string,
    @Res() response: Response,
  ) {
    if (!email) {
      throw new BadRequestException("No such user exists");
    }

    try {
      this.logger.info(`Looking up the user: ${email}`);
      const user: any = await this.usersService.userLogin(email);
      if (!user) {
        throw new BadRequestException("User not found");
      }
      return response.status(HttpStatus.OK).send(user);
    } catch (error) {
      throw new BadRequestException("User details could not be fetched");
    }
  }

  @Get("total/:id")
  async getService(@Param("id") userId: number, @Res() response: Response) {
    const result = await this.usersService.getTotalServiceRequest(userId);
    return response.status(HttpStatus.OK).json(result[0]);
  }
}
