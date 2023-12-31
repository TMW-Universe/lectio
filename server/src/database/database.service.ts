import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor() {
    // super({
    //   log: [{ emit: 'event', level: 'query' }],
    // });

    // this.$on('query' as never, (event: Prisma.QueryEvent) => {
    //   console.log('Query: ' + event.query);
    //   console.log('Duration: ' + event.duration + 'ms');
    // });

    super();
  }

  async onModuleInit() {
    await this.$connect();
  }
}
