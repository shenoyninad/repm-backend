import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { Property } from "@entities/property.entity";
import { PropertyManager } from "@entities/property-manager.entity";
import { CreatePropertyDto } from "@properties/dtos/create-property.dto";
import { CreatePropertyManagerDto } from "@properties/dtos/create-property-manager.dto";
import { User } from "@entities/user.entity";
import {
  RoleType,
  ServiceRequestStatus,
  PropertyManagerAssignment,
} from "@enums/repm.enum";
import { Op, fn, col, literal } from "sequelize";
import { ServiceRequest } from "@entities/service-request.entity";
import { ServiceRequestLog } from "@entities/service-request-log.entity";
import { Document } from "@entities/document.entity";
import { Sequelize } from "sequelize-typescript";
import { getConfig } from "@utils/configUtils";
import { PropertyDocument } from "@entities/property-document.entity";

@Injectable()
export class PropertiesService {
  constructor(@Inject("Logger") private readonly logger) {}

  async getPropertiesByOwnerId(ownerId: number): Promise<Property[]> {
    const properties = await Property.findAll({
      where: {
        ownerId,
      },
      include: [
        {
          model: PropertyManager,
          where: { activeInd: PropertyManagerAssignment.ASSIGNEDACTIVE },
          foreignKey: "propertyId",
          required: false,
          include: [{ model: User, required: true }],
        },
      ],
    });

    if (!properties) {
      throw new NotFoundException("Properties not found");
    }
    return properties;
  }

  async getPropertyByPropertyId(ID: number): Promise<Property> {
    const property = await Property.findOne({
      where: {
        ID,
      },
      include: [
        {
          model: PropertyManager,
          where: { activeInd: PropertyManagerAssignment.ASSIGNEDACTIVE },
          required: false,
          include: [{ model: User, required: true }],
        },
        { model: User, required: true },
      ],
    });

    if (!property) {
      throw new NotFoundException("Property not found");
    }

    return property;
  }

  async getPropertiesByManagerId(
    managerId: number,
  ): Promise<PropertyManager[]> {
    const properties = await PropertyManager.findAll({
      where: { managerId, activeInd: PropertyManagerAssignment.ASSIGNEDACTIVE },
      include: [
        {
          model: Property,
          required: true,
          include: [{ model: User, required: true }],
        },
        { model: User, required: true },
      ],
    });

    if (!properties) {
      throw new NotFoundException("Properties not found");
    }

    return properties;
  }

  async deactivateManager(ID: number): Promise<any> {
    const currentDate = new Date();
    const result = await PropertyManager.update(
      {
        activeInd: PropertyManagerAssignment.ASSIGNEDINACTIVE,
        endDate: currentDate,
      },
      {
        where: {
          ID: ID,
        },
      },
    );

    return result;
  }

  async getManagers(username: string): Promise<User[]> {
    const propertyManagers = await User.findAll({
      where: {
        roleType: RoleType.PROPERTYMANAGER,
        enabled: true,
        username: {
          [Op.like]: `%${username}%`,
        },
      },
      attributes: {
        exclude: ["password"],
      },
    });

    if (!propertyManagers) {
      throw new NotFoundException("Property Managers not found");
    }

    return propertyManagers;
  }

  async createProperty(
    createPropertyDto: CreatePropertyDto,
    image: Express.Multer.File,
  ): Promise<Property> {
    const property = await Property.create({
      image: image.buffer,
      ...createPropertyDto,
    });

    return property;
  }

  async assignPropertyManager(
    propertyId: number,
    createPropertyManagerDto: CreatePropertyManagerDto,
  ): Promise<PropertyManager> {
    const propertyManager = await PropertyManager.create({
      propertyId,
      ...createPropertyManagerDto,
    });

    return propertyManager;
  }

  async getServiceRequestsForProperty(propertyId: number): Promise<any> {
    const serviceRequests = await ServiceRequest.findAll({
      where: { propertyId },
      include: [
        { model: Document, required: false },
        { model: ServiceRequestLog, required: false },
        { model: User, required: true },
      ],
    });

    return serviceRequests;
  }

  async getAvgRating(username: string): Promise<any> {
    try {
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

      const result = await sequelize.query(
        `SELECT
        U.userId AS userId,
    U.firstname AS firstname,
    U.lastname AS lastname,
    U.email AS email,
    U.phone AS phone,
    AVG(SR.rating) AS averageRating,
    COUNT(SR.ID) AS totalServiceRequests
    FROM
        users AS U
    LEFT JOIN
        propertymanagers AS PM ON U.userId = PM.managerId
    LEFT JOIN
        properties AS P ON PM.propertyId = P.ID
    LEFT JOIN
        servicerequests AS SR ON P.ID = SR.propertyId
    WHERE
        U.roleType = '${RoleType.PROPERTYMANAGER}' 
        AND (SR.status = '${ServiceRequestStatus.COMPLETED}' OR SR.ID IS NULL OR SR.status = '${ServiceRequestStatus.SENT}')
        AND U.username LIKE '${username}%'
    GROUP BY
        U.userId, U.username, U.firstname, U.lastname, U.email, U.phone;`,
      );

      const rows = result[0] as {
        userId: number;
        firstname: string;
        lastname: string;
        email: string;
        phone: string;
        averageRating: number | null;
        totalServiceRequests: number;
      }[];

      rows.forEach((entry) => {
        if (entry.averageRating === null) {
          entry.totalServiceRequests = 0;
        }
      });

      return rows;
    } catch (error) {
      this.logger.info(`DataBase error on query to get Avg Rating: ${error}`);
      throw error;
    }
  }

  async getAvgRatingforOneManager(userId: number): Promise<any> {
    try {
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

      const result = await sequelize.query(
        `SELECT
        U.userId AS userId,
    U.firstname AS firstname,
    U.lastname AS lastname,
    U.email AS email,
    U.phone AS phone,
    AVG(SR.rating) AS averageRating,
    COUNT(SR.ID) AS totalServiceRequests
    FROM
        users AS U
    LEFT JOIN
        propertymanagers AS PM ON U.userId = PM.managerId
    LEFT JOIN
        properties AS P ON PM.propertyId = P.ID
    LEFT JOIN
        servicerequests AS SR ON P.ID = SR.propertyId
    WHERE
        U.roleType = '${RoleType.PROPERTYMANAGER}' 
        AND (SR.status = '${ServiceRequestStatus.COMPLETED}')
        AND U.userId =${userId}
    GROUP BY
        U.userId, U.username, U.firstname, U.lastname, U.email, U.phone;`,
      );

      const rows = result[0] as {
        userId: number;
        firstname: string;
        lastname: string;
        email: string;
        phone: string;
        averageRating: number | null;
        totalServiceRequests: number;
      }[];

      rows.forEach((entry) => {
        if (entry.averageRating === null) {
          entry.totalServiceRequests = 0;
        }
      });

      return rows;
    } catch (error) {
      this.logger.info(`DataBase error on query to get Avg Rating: ${error}`);
      throw error;
    }
  }

  async getDash(userId: number): Promise<any> {
    const result = await Property.findAll({
      attributes: [
        "ID",
        "name",
        [fn("COUNT", col("ServiceRequests.ID")), "TotalSR"],
      ],
      include: [
        {
          model: User,
          attributes: [],
          where: { userId: userId },
        },
        {
          model: ServiceRequest,
          attributes: ["type", "status", [fn("SUM", col("price")), "SRLPrice"]],
          include: [{ model: ServiceRequestLog, attributes: [] }],
        },
      ],
      group: [
        "ServiceRequests.ID",
        "Property.ID",
        "Property.name",
        "servicerequests.type",
        "servicerequests.status",
      ],
    });

    return result;
  }

  async addPropertyDocument(
    propertyId: number,
    document: Express.Multer.File,
  ): Promise<any> {
    try {
      const createdDocument = await PropertyDocument.create({
        name: document.originalname,
        content: document.buffer,
        propertyId: propertyId,
      });
      return createdDocument;
    } catch (error) {
      console.error("Database error: ", error);
    }
  }

  async retrievePropertyDocuments(propertyId: number): Promise<any> {
    try {
      const documents = await PropertyDocument.findAll({
        where: { propertyId },
      });
      return documents;
    } catch (error) {
      console.error("Database error: ", error);
    }
  }
}
