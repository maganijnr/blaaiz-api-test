import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { TransactionsModule } from './transactions/transactions.module';
import { TransactionsController } from './transactions/transactions.controller';
import { TransactionsService } from './transactions/transactions.service';

@Module({
  imports: [PrismaModule, TransactionsModule],
  controllers: [AppController, TransactionsController],
  providers: [AppService, PrismaService, TransactionsService],
})
export class AppModule {}
