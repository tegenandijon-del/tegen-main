import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { telegramSend } from './notify';
@Controller('messages')
export class MessageController { constructor(private prisma:PrismaService){}
 @Get('order/:id') list(@Param('id',ParseIntPipe) id:number){return this.prisma.message.findMany({where:{orderId:id},orderBy:{createdAt:'asc'}})}
 @Post('incoming') async incoming(@Body() b:{telegramId:string;text:string;orderId?:number}){const u=await this.prisma.user.findUnique({where:{telegramId:BigInt(b.telegramId)}});if(!u) return null;return this.prisma.message.create({data:{userId:u.id,orderId:b.orderId,direction:'IN',text:b.text}})}
 @Post('admin/reply') async reply(@Body() b:{orderId:number;text:string}){const o=await this.prisma.order.findUnique({where:{id:b.orderId},include:{user:true}});if(!o)throw new Error('Order not found');const m=await this.prisma.message.create({data:{userId:o.userId,orderId:o.id,direction:'OUT',text:b.text}});await telegramSend(o.user.telegramId,`👨‍💼 Admin javobi\nBuyurtma #${o.orderNumber}\n\n${b.text}`);return m;}
                               }
