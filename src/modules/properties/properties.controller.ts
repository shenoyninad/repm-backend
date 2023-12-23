import {
  Controller,
  Get,
  Query,
  BadRequestException,
  Res,
  HttpStatus,
  Post,
  UseInterceptors,
  Body,
  UploadedFile,
  Param,
  Inject,
  Put,
} from "@nestjs/common";
import { PropertiesService } from "./provider/properties.service";
import { Response } from "express";
import { Property } from "@entities/property.entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { fileFilter } from "@utils/file-upload.utils";
import { CreatePropertyDto } from "./dtos/create-property.dto";
import { CreatePropertyManagerDto } from "./dtos/create-property-manager.dto";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { PropertyManager } from "@entities/property-manager.entity";
import { User } from "@entities/user.entity";

@Controller("properties")
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService,
    @Inject("Logger") private readonly logger,
  ) {}

  @Get("managers")
  async getAllPropertyManagers(
    @Query("username") username: string,
    @Res() response: Response,
  ) {
    try {
      this.logger.info(
        `Fetching property managers with the username filter of ${username}`,
      );
      const managers: User[] = await this.propertiesService.getManagers(
        username ?? "",
      );
      return response.status(HttpStatus.OK).send(managers);
    } catch (error) {
      this.logger.info(
        `Property managers not found with the username filter of ${username}`,
      );
      return response.status(HttpStatus.OK).send({
        code: "property-managers-not-found",
        message: "Property managers data not found",
      });
    }
  }

  @Get("propertiesByOwner")
  async findPropertiesByOwnerId(
    @Query("ownerId") ownerId: number,
    @Res() response: Response,
  ) {
    if (ownerId == null || ownerId === 0) {
      this.logger.info(
        `Failed fetching Properties because owner Id is ${ownerId}`,
      );
      throw new BadRequestException("Owner ID cannot be 0 or null");
    }

    try {
      this.logger.info(`Fetching properties by owner Id ${ownerId}`);
      const properties: Property[] =
        await this.propertiesService.getPropertiesByOwnerId(ownerId);
      return response.status(HttpStatus.OK).send(properties);
    } catch (error) {
      this.logger.info(`Properties does not exist by owner Id ${ownerId}`);
      return response.status(HttpStatus.OK).send({
        code: "properties-not-found",
        message: "Property details could not be fetched",
      });
    }
  }

  @Get()
  async findPropertyByPropertyId(
    @Query("propertyId") propertyId: number,
    @Res() response: Response,
  ) {
    if (propertyId == null || propertyId === 0) {
      this.logger.info(
        `Failed fetching Property because property Id is ${propertyId}`,
      );
      throw new BadRequestException("Property ID cannot be 0 or null");
    }

    try {
      this.logger.info(`Fetching property by propertyId ${propertyId}`);
      const property: Property =
        await this.propertiesService.getPropertyByPropertyId(propertyId);
      return response.status(HttpStatus.OK).send(property);
    } catch (error) {
      this.logger.info(`Property does not exist by propertyId ${propertyId}`);
      return response.status(HttpStatus.OK).send({
        code: "property-not-found",
        message: "Property details could not be fetched",
      });
    }
  }

  @Put("deactivateManager/:pmId")
  async deactivateManager(
    @Param("pmId") pmId: number,
    @Res() response: Response,
  ) {
    if (pmId == null || pmId === 0) {
      this.logger.info(
        `Failed to Deactivate manager with ID: ${pmId} in PropertyManagers table`,
      );
      throw new BadRequestException("ID cannot be 0 or null");
    }

    try {
      const deactivatedManager =
        await this.propertiesService.deactivateManager(pmId);
      return response.status(HttpStatus.OK).send(deactivatedManager);
    } catch (error) {
      this.logger.info(`No such ${pmId} exists in PropertyManager table`);
      return response.status(HttpStatus.OK).send({
        code: "manager-not-found",
        message: "Manager could not be deactivated",
      });
    }
  }

  @Get("propertiesByManager")
  async getPropertiesByManagerId(
    @Query("managerId") managerId: number,
    @Res() response: Response,
  ) {
    if (managerId == null || managerId === 0) {
      this.logger.info(
        `Failed fetching Properties because manager Id is ${managerId}`,
      );
      throw new BadRequestException("Manager ID cannot be 0 or null");
    }

    try {
      this.logger.info(`Fetching properties by managerId ${managerId}`);
      const properties: PropertyManager[] =
        await this.propertiesService.getPropertiesByManagerId(managerId);
      return response.status(HttpStatus.OK).send(properties);
    } catch (error) {
      this.logger.info(`Properties does not exist by managerId ${managerId}`);
      return response.status(HttpStatus.OK).send({
        code: "property-not-found",
        message: "Property details could not be fetched",
      });
    }
  }

  @Post(":propertyId/manager")
  async assignPropertyManager(
    @Param("propertyId") propertyId: number,
    @Body() createPropertyManagerDto: CreatePropertyManagerDto,
    @Res() response: Response,
  ): Promise<any> {
    const validateCreatePropertyManager = plainToClass(
      CreatePropertyManagerDto,
      createPropertyManagerDto,
    );
    const errors = await validate(validateCreatePropertyManager);

    if (errors.length > 0) {
      this.logger.info(
        `Validation Error occured while assigning a manager ${createPropertyManagerDto.managerId} to the property ${propertyId}`,
      );
      throw new BadRequestException(errors);
    }

    try {
      this.logger.info(
        `Assigning a manager ${createPropertyManagerDto.managerId} to the property ${propertyId}`,
      );
      const propertyManager =
        await this.propertiesService.assignPropertyManager(
          propertyId,
          createPropertyManagerDto,
        );

      if (!propertyManager) {
        this.logger.info(
          `Failed to assign a manager ${createPropertyManagerDto.managerId} to the property ${propertyId}`,
        );
        throw new BadRequestException("Failed to assign property manager");
      }
      return response.status(HttpStatus.CREATED).send(propertyManager);
    } catch (error) {
      this.logger.info(
        `Failed to assign a manager ${createPropertyManagerDto.managerId} to the property ${propertyId}`,
      );
      console.error(error);
      throw new BadRequestException(error);
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor("image", {
      fileFilter,
    }),
  )
  async createProperty(
    @Body("data") propertyRequest: any,
    @UploadedFile() propertyImage: Express.Multer.File,
    @Res() response: Response,
  ): Promise<any> {
    if (!propertyImage) {
      this.logger.info(`Failed Creating a property: Image not found`);
      throw new BadRequestException("At least one image is required.");
    }

    const createPropertyDto: CreatePropertyDto = JSON.parse(propertyRequest);
    this.logger.info(
      `Creating a property for the owner Id: ${createPropertyDto.ownerId}`,
    );
    try {
      const property = await this.propertiesService.createProperty(
        createPropertyDto,
        propertyImage,
      );
      if (!property) {
        this.logger.info(
          `Failed to add a property the owner Id: ${createPropertyDto.ownerId}`,
        );
        throw new BadRequestException("Failed to add a property");
      }
      return response.status(HttpStatus.CREATED).send(property);
    } catch (error) {
      this.logger.info(
        `Failed to add a property the owner Id: ${createPropertyDto.ownerId}`,
      );
      throw new BadRequestException(error);
    }
  }

  @Get(":propertyId/serviceRequests")
  async viewServiceRequest(
    @Param("propertyId") propertyId: number,
    @Res() response: Response,
  ): Promise<any> {
    try {
      this.logger.info(
        `Looking up Service Requests for the property: ${propertyId}`,
      );
      const allServiceRequests: any =
        await this.propertiesService.getServiceRequestsForProperty(propertyId);
      if (!allServiceRequests) {
        this.logger.info(
          `No Service Request found for the property: ${propertyId}`,
        );
        throw new BadRequestException(
          "No Service Request found for this property.",
        );
      }
      return response.status(HttpStatus.OK).json(allServiceRequests);
    } catch (error) {
      this.logger.info(
        `Service Requests could not be fetched for the property: ${propertyId}`,
      );
      throw new BadRequestException("Service Requests could not be fetched");
    }
  }

  @Get("avg")
  async getAvgRating(
    @Query("username") username: string,
    @Query("userId") userId: number,
    @Query("flag") islist: string,
    @Res() response: Response,
  ) {
    if (islist === "true") {
      const result = await this.propertiesService.getAvgRating(username ?? "");
      return response.status(HttpStatus.OK).json(result);
    } else {
      const result =
        await this.propertiesService.getAvgRatingforOneManager(userId);
      return response.status(HttpStatus.OK).json(result);
    }
  }

  @Get("dash")
  async getDashboard(
    @Query("userId") userId: number,
    @Res() response: Response,
  ) {
    const result = await this.propertiesService.getDash(userId);
    return response.status(HttpStatus.OK).json(result);
  }

  @Post(":propertyId/documents")
  @UseInterceptors(
    FileInterceptor("document", {
      fileFilter,
    }),
  )
  async addPropertyDocument(
    @Param("propertyId") propertyId: number,
    @Res() response: Response,
    @UploadedFile() document: Express.Multer.File,
  ): Promise<any> {
    try {
      this.logger.info(`Adding the document: ${document.originalname}`);

      const uploadedPropertyDocument =
        await this.propertiesService.addPropertyDocument(propertyId, document);
      return response.status(HttpStatus.CREATED).send(uploadedPropertyDocument);
    } catch (error) {
      this.logger.info(`Failed to add document: ${document.originalname}`);
      throw new BadRequestException("Failed to add document");
    }
  }

  @Get(":propertyId/documents")
  async fetchDocumentsByProperty(
    @Param("propertyId") propertyId: number,
    @Res() response: Response,
  ): Promise<any> {
    try {
      this.logger.info(`Fetching the documents for property: ${propertyId}`);

      const uploadedPropertyDocuments =
        await this.propertiesService.retrievePropertyDocuments(propertyId);
      return response
        .status(HttpStatus.CREATED)
        .send(uploadedPropertyDocuments);
    } catch (error) {
      this.logger.info(
        `Failed to fetch documents for the property: ${propertyId}`,
      );
      throw new BadRequestException(
        "Failed to fetch documents for the property",
      );
    }
  }
}
