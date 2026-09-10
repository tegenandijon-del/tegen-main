import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PrismaService } from './prisma.service';
@Controller('users') export class UserController{constructor(private prisma:PrismaService){}
 @Post('upsert') upsert(@Body() b:any){return this.prisma.user.upsert({where:{telegramId:BigInt(b.telegramId)},update:{firstName:b.firstName,lastName:b.lastName,username:b.username,phone:b.phone},create:{telegramId:BigInt(b.telegramId),firstName:b.firstName,lastName:b.lastName,username:b.username,phone:b.phone}})}
 @Get(':telegramId') get(@Param('telegramId') id:string){return this.prisma.user.findUnique({where:{telegramId:BigInt(id)},include:{orders:{orderBy:{createdAt:'desc'},include:{items:{include:{product:true}}}}}})}
 @Get() list(){return this.prisma.user.findMany({orderBy:{createdAt:'desc'},include:{_count:{select:{orders:true}}}})}
                                                }
