/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "@users/dtos/create-user.dto";
import { User } from "@entities/user.entity";
import * as bcrypt from "bcrypt";
import { PropertyManager } from "@entities/property-manager.entity";
import { Property } from "@entities/property.entity";
import { ServiceRequest } from "@entities/service-request.entity";
import { ServiceRequestLog } from "@entities/service-request-log.entity";
import { Sequelize } from "sequelize";
import { getConfig } from "@utils/configUtils";

@Injectable()
export class UsersService {
  constructor() {
    /* add service code here */
  }

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    let user = await User.create({
      ...createUserDto,
      password: hashedPassword,
    });
    delete user.password;
    return user;
  }

  async findUser(userId: number): Promise<User> {
    const user = await User.findOne({
      where: { userId },
      attributes: {
        exclude: ["password"],
      },
    });
    return user;
  }

  async userLogin(email: string): Promise<User> {
    const user = await User.findOne({
      where: { email },
    });
    return user;
  }

  async getTotalServiceRequest(userId: number): Promise<any> {
    const config = getConfig();
    const sequelize = new Sequelize({
      dialect: config.db.dialect,
      host: config.db.host,
      port: config.db.port,
      username: config.db.username,
      password: config.db.password,
      database: config.db.database,
      logging: true,
    });

    const result = sequelize.query(`
    SELECT
    P.ID AS PropertyId,
    P.name AS PropertyName,
    COUNT(SR.ID) AS TotalSR,
    SR.status AS SRStatus
FROM
    users AS U
    LEFT JOIN propertymanagers AS PM ON U.userId = PM.managerId
    LEFT JOIN properties AS P ON PM.propertyId = P.ID
    LEFT JOIN servicerequests AS SR ON P.ID = SR.propertyId AND P.ID = SR.propertyId
WHERE
    U.userId = ${userId}
GROUP BY
    P.ID, P.name, SR.status;`);
    return result;
  }
}
