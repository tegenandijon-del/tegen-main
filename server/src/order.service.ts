import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { telegramSend } from './notify';

const STATUSES = ['NEW','ACCEPTED','PREPARING','READY','CANCELLED'];
const statusText: Record<string,string> = {NEW:'Yangi',ACCEPTED:'Qabul qilindi',PREPARING:'Tayyorlanmoqda',READY:'Tayyor',CANCELLED:'Bekor qilindi'};

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(body: {telegramId:string; firstName?:string; lastName?:string; username?:string; phone?:string; items:{productId:number;quantity:number}[]}) {
    if (!body.telegramId || !body.items?.length) throw new BadRequestException('Mahsulotlar tanlanmagan');
    const user = await this.prisma.user.upsert({
      where:{telegramId:BigInt(body.telegramId)},
      update:{firstName:body.firstName,lastName:body.lastName,username:body.username,phone:body.phone},
      create:{telegramId:BigInt(body.telegramId),firstName:body.firstName,lastName:body.lastName,username:body.username,phone:body.phone}
    });
    const ids=[...new Set(body.items.map(x=>x.productId))];
    const products=await this.prisma.product.findMany({where:{id:{in:ids},isActive:true}});
    if(products.length!==ids.length) throw new BadRequestException('Mahsulotlardan biri mavjud emas');
    const rows=body.items.map(i=>{const p=products.find(x=>x.id===i.productId)!; const q=Math.max(1,Math.floor(i.quantity)); return {productId:p.id,quantity:q,price:p.price};});
    const total=rows.reduce((s,x)=>s+x.price*x.quantity,0);
    const orderNumber=`TG-${Date.now().toString().slice(-8)}`;
    const order=await this.prisma.order.create({data:{orderNumber,total,phone:body.phone,userId:user.id,items:{create:rows}},include:{items:{include:{product:true}},user:true}});
    await telegramSend(user.telegramId,`🛍 Buyurtmangiz qabul qilindi\n№ ${order.orderNumber}\n💰 ${total.toLocaleString('uz-UZ')} so'm\nHolat: Yangi`);
    return order;
  }
  getOrders(){return this.prisma.order.findMany({orderBy:{createdAt:'desc'},include:{user:true,items:{include:{product:true}},messages:{orderBy:{createdAt:'asc'}}}});}
  getOrder(id:number){return this.prisma.order.findUnique({where:{id},include:{user:true,items:{include:{product:true}},messages:{orderBy:{createdAt:'asc'}}}});}
  async updateStatus(id:number,status:string){
    if(!STATUSES.includes(status)) throw new BadRequestException('Noto\'g\'ri status');
    const order=await this.prisma.order.update({where:{id},data:{status},include:{user:true,items:{include:{product:true}}}});
    await telegramSend(order.user.telegramId,`📦 Buyurtma #${order.orderNumber}\nHolat: ${statusText[status]}`);
    return order;
  }
      }
