import { Sequelize } from "sequelize-typescript";
import { getConfig } from "@utils/configUtils";
import { User } from "@entities/user.entity";
import { Property } from "@entities/property.entity";
import { ServiceRequest } from "@entities/service-request.entity";
import { ServiceRequestLog } from "@entities/service-request-log.entity";
import { Document } from "@entities/document.entity";
import { PropertyManager } from "@entities/property-manager.entity";
import { Reminder } from "@entities/reminder.entity";
import { PropertyDocument } from "@entities/property-document.entity";
import * as tedious from "tedious";

const config = getConfig();

export const databaseProviders = [
  {
    provide: "SEQUELIZE",
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: config.db.dialect,
        host: config.db.host,
        port: config.db.port,
        username: config.db.username,
        password: config.db.password,
        database: config.db.database,
        logging: true,
        dialectModule: tedious,
      });

      sequelize.addModels([
        User,
        Property,
        ServiceRequest,
        ServiceRequestLog,
        Document,
        PropertyManager,
        Reminder,
        PropertyDocument,
      ]);

      await sequelize.sync();
      return sequelize;
    },
  },
];
