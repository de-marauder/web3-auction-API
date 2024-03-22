import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { EnvConfigEnum } from 'src/config/env.enum';
import { EnvTypeEnum } from 'src/env/enum/env.enum';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    private config: ConfigService,
  ) { }

  getDatabaseConnection(): Connection {
    this.logger.log('database connection returned');
    return this.connection;
  }

  async cleanDataBase() {
    const environment = await this.config.getOrThrow(EnvConfigEnum.NODE_ENV);
    if (environment === EnvTypeEnum.Production) return;
    const collections = await this.connection.db.collections();
    collections.forEach(async (collection) => {
      await collection.drop();
    });
    // console.log('Done cleaning database');
  }
}
