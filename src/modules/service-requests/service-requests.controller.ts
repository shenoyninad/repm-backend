import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Res,
  Inject,
  BadRequestException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Param,
} from "@nestjs/common";
import { ServiceRequestsService } from "./provider/service-requests.service";
import { CreateServiceRequestDto } from "./dtos/create-service-request.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { fileFilter } from "@utils/file-upload.utils";
import { Response } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { CreateServiceRequestLogDto } from "@serviceRequest/dtos/create-service-request-log.dto";
import { UpdateServiceRequestDto } from "./dtos/update-service-request.dto";

@Controller("serviceRequests")
export class ServiceRequestsController {
  constructor(
    private readonly serviceRequestsService: ServiceRequestsService,
    @Inject("Logger") private readonly logger,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("image", {
      fileFilter,
    }),
  )
  async createServiceRequest(
    @Body("data") createServiceRequestDto: any,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<any> {
    const serviceRequestDto: CreateServiceRequestDto = JSON.parse(
      createServiceRequestDto,
    );

    const serviceRequests = plainToClass(
      CreateServiceRequestDto,
      serviceRequestDto,
    );
    const errors = await validate(serviceRequests);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    if (!image) {
      throw new BadRequestException("At least one image is required.");
    }
    try {
      this.logger.info(
        `Creating service request for property Id: ${serviceRequestDto.propertyId}`,
      );
      const serviceRequest =
        await this.serviceRequestsService.createServiceRequest(
          serviceRequestDto,
          image,
        );

      if (!serviceRequest) {
        this.logger.info(
          `Failed to create service request for property Id: ${serviceRequestDto.propertyId}`,
        );
        throw new BadRequestException("Failed to create service request");
      }

      return serviceRequest;
   
  } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(":srId")
  async getServiceRequest(
    @Param("srId") serviceRequestId: number,
    @Res() response: Response,
  ): Promise<any> {
    try {
      this.logger.info(`Looking up the service request: ${serviceRequestId}`);
      const serviceRequest: any =
        await this.serviceRequestsService.getServiceRequest(serviceRequestId);
      if (!serviceRequest) {
        throw new BadRequestException("Service Request not found");
      }
      return response.status(HttpStatus.OK).json(serviceRequest);
    } catch (error) {
      this.logger.info(
        `service request not found of service request id: ${serviceRequestId}`,
      );
      throw new BadRequestException("Service Request could not be fetched");
    }
  }

  @Get(":srId/logs")
  async getServiceRequestLogs(
    @Param("srId") serviceRequestId: number,
    @Res() response: Response,
  ): Promise<any> {
    try {
      this.logger.info(
        `Looking up the service request logs: ${serviceRequestId}`,
      );
      const allServiceRequestLogs: any =
        await this.serviceRequestsService.getServiceRequestLogs(
          serviceRequestId,
        );
      if (!allServiceRequestLogs) {
        throw new BadRequestException(
          "No Service Request Logs found for this Service Request.",
        );
      }
      return response.status(HttpStatus.OK).json(allServiceRequestLogs);
    } catch (error) {
      this.logger.info(
        `Error in fetching service request logs for service request Id: ${serviceRequestId}`,
      );
      throw new BadRequestException(
        "Service Request Logs could not be fetched",
      );
    }
  }

  @Post(":srId/logs")
  async createServiceRequestLog(
    @Param("srId") serviceRequestId: number,
    @Body() createServiceRequestLogDto: CreateServiceRequestLogDto,
    @Res() response: Response,
  ): Promise<any> {
    const validateServiceRequestLog = plainToClass(
      CreateServiceRequestLogDto,
      createServiceRequestLogDto,
    );
    const errors = await validate(validateServiceRequestLog);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    this.logger.info(
      `Creating service request logs for service request id: ${serviceRequestId}`,
    );
    const serviceRequestLog =
      await this.serviceRequestsService.createServiceRequestLog(
        serviceRequestId,
        createServiceRequestLogDto,
      );

    if (!serviceRequestLog) {
      this.logger.info(
        `Failed to create service request logs for service request Id: ${serviceRequestId}`,
      );
      throw new BadRequestException("Failed to create Service Request Log");
    }

    return response.status(HttpStatus.CREATED).send(serviceRequestLog);
  }

  @Put(":srId")
  async updateServiceRequest(
    @Param("srId") serviceRequestId: number,
    @Body() updateServiceRequestDto: UpdateServiceRequestDto,
    @Res() response: Response,
  ) {
    if (Object.keys(updateServiceRequestDto).length > 0) {
      try {
        this.logger.info(
          `Updated the service request having service request Id: ${serviceRequestId}`,
        );
        const updatedServiceRequest =
          await this.serviceRequestsService.updateServiceRequest(
            serviceRequestId,
            updateServiceRequestDto,
          );

        return response.status(HttpStatus.CREATED).send({
          code: "service-request-updated",
          message: `${updatedServiceRequest} row updated in the service request table`,
        });
      } catch (error) {
        this.logger.info(
          `Failed to update service request having Id: ${serviceRequestId}`,
        );
        throw new BadRequestException("Failed to update the service request");
      }
    } else {
      this.logger.info(
        `NO service request exist with service request Id: ${serviceRequestId}`,
      );
      throw new BadRequestException("Body can't be empty");
    }
  }

  @Post(":srId/documents")
  @UseInterceptors(
    FileInterceptor("document", {
      fileFilter,
    }),
  )
  async addDocument(
    @Param("srId") serviceRequestId: number,
    @Res() response: Response,
    @UploadedFile() document: Express.Multer.File,
  ): Promise<any> {
    try {
      this.logger.info(`Adding the document: ${document.originalname}`);

      const uploadedDocument = await this.serviceRequestsService.addDocument(
        serviceRequestId,
        document,
      );
      return response.status(HttpStatus.CREATED).send(uploadedDocument);
    } catch (error) {
      this.logger.info(`Failed to add document: ${document.originalname}`);
      throw new BadRequestException("Failed to add document");
    }
  }
}
