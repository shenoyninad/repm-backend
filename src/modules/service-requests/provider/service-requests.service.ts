import { Injectable, BadRequestException, Inject } from "@nestjs/common";
import { ServiceRequest } from "@entities/service-request.entity";
import { CreateServiceRequestDto } from "../dtos/create-service-request.dto";
import { Document } from "@entities/document.entity";
import { ServiceRequestStatus } from "@enums/repm.enum";
import { ServiceRequestLog } from "@entities/service-request-log.entity";
import { CreateServiceRequestLogDto } from "@serviceRequest/dtos/create-service-request-log.dto";
import { UpdateServiceRequestDto } from "@serviceRequest/dtos/update-service-request.dto";
import { Property } from "@entities/property.entity";
import { User } from "@entities/user.entity";
import { PropertyManager } from "@entities/property-manager.entity";

@Injectable()
export class ServiceRequestsService {
  constructor(@Inject("Logger") private readonly logger) {}

  async createServiceRequest(
    createServiceRequestDto: CreateServiceRequestDto,
    image: Express.Multer.File,
  ): Promise<any> {
    if (!image) {
      throw new BadRequestException("At least one image is required.");
    }

    const createdServiceRequest = await ServiceRequest.create({
      status: ServiceRequestStatus.SENT,
      requestDate: new Date(),
      image: image.buffer,
      ...createServiceRequestDto,
    });

    return createdServiceRequest;
  }

  async getServiceRequest(serviceRequestId: number): Promise<any> {
    const serviceRequest = await ServiceRequest.findOne({
      where: { ID: serviceRequestId },

      include: [
        { model: Document, required: false },
        { model: User, required: true },
        { model: ServiceRequestLog, required: false },
        {
          model: Property,
          required: true,
          include: [
            {
              model: User,
              required: true,
            },
            {
              model: PropertyManager,
              required: false,
              include: [
                {
                  model: User,
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    });
    return serviceRequest;
  }

  async getServiceRequestLogs(serviceRequestId: number): Promise<any> {
    const serviceRequestLogs = await ServiceRequestLog.findAll({
      where: { serviceRequestId },
    });
    return serviceRequestLogs;
  }

  async createServiceRequestLog(
    serviceRequestId: number,
    createServiceRequestLogDto: CreateServiceRequestLogDto,
  ): Promise<any> {
    const createdServiceRequestLog = await ServiceRequestLog.create({
      serviceRequestId,
      ...createServiceRequestLogDto,
    });

    return createdServiceRequestLog;
  }

  async updateServiceRequest(
    serviceRequestId: number,
    updateServiceRequestDto: UpdateServiceRequestDto,
  ) {
    const result = await ServiceRequest.update(
      {
        ...updateServiceRequestDto,
      },
      {
        where: { ID: serviceRequestId },
      },
    );

    return result;
  }

  async addDocument(
    serviceRequestId: number,
    document: Express.Multer.File,
  ): Promise<any> {
    try {
      const createdDocument = await Document.create({
        name: document.originalname,
        content: document.buffer,
        serviceRequestId: serviceRequestId,
      });
      return createdDocument;
    } catch (error) {
      console.error("Database error:", error);
    }
  }

  async retrieveDocuments(serviceRequestId: number): Promise<any> {
    const documents = await Document.findAll({
      where: { serviceRequestId },
    });
    return documents;
  }
}
