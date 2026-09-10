import { Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from './prisma.service';
@Controller('proposals')
export class ProposalController { constructor(private prisma:PrismaService){}
 @Post() async create(@Body() b:any){const user=await this.prisma.user.findUnique({where:{telegramId:BigInt(b.telegramId)}});if(!user)throw new Error('User not found');const worker=await this.prisma.worker.findUnique({where:{telegramId:user.telegramId}});if(!worker||!worker.isActive)throw new Error('Worker access denied'); if(worker.categoryId && Number(b.categoryId)!==worker.categoryId)throw new Error('Bu bo\'limga ruxsat yo\'q');return this.prisma.productProposal.create({data:{workerId:user.id,categoryId:Number(b.categoryId),productId:b.productId?Number(b.productId):null,action:b.action||'CREATE',title:b.title,price:Number(b.price),oldPrice:b.oldPrice?Number(b.oldPrice):null,image:b.image,description:b.description,analysis:b.analysis}})}
                                }
