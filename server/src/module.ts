import { Controller, Get, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CatalogController } from './catalog.controller';
import { AdminController } from './admin.controller';
import { MessageController } from './message.controller';
import { ProposalController } from './proposal.controller';
import { UserController } from './user.controller';
@Controller('health') class HealthController { @Get() health(){return {ok:true,service:'tegen-api',time:new Date().toISOString()};} }
@Module({controllers:[HealthController,OrderController,CatalogController,AdminController,MessageController,ProposalController,UserController],providers:[PrismaService,OrderService]}) export class AppModule {}
