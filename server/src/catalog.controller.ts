import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { PrismaService } from './prisma.service';
const slug=(s:string)=>s.toLowerCase().trim().replace(/[^a-z0-9а-яёқғҳў' -]/gi,'').replace(/['’]/g,'').replace(/\s+/g,'-');
@Controller('catalog')
export class CatalogController {
 constructor(private prisma:PrismaService){}
 @Get('categories') categories(){return this.prisma.category.findMany({where:{isActive:true},orderBy:{name:'asc'},include:{_count:{select:{products:true}}}})}
 @Post('categories') createCategory(@Body() b:{name:string}){if(!b.name?.trim()) throw new Error('name required'); const s=slug(b.name); return this.prisma.category.create({data:{name:b.name.trim(),slug:s}})}
 @Patch('categories/:id') rename(@Param('id',ParseIntPipe) id:number,@Body() b:{name:string}){return this.prisma.category.update({where:{id},data:{name:b.name,slug:slug(b.name)}})}
 @Delete('categories/:id') deleteCategory(@Param('id',ParseIntPipe) id:number){return this.prisma.category.update({where:{id},data:{isActive:false}})}
 @Get('products') products(){return this.prisma.product.findMany({orderBy:{createdAt:'desc'},include:{category:true}})}
 @Get('products/:id') product(@Param('id',ParseIntPipe) id:number){return this.prisma.product.findUnique({where:{id},include:{category:true}})}
 @Post('products') create(@Body() b:any){return this.prisma.product.create({data:{title:b.title,slug:slug(b.slug||b.title)+`-${Date.now()}`,description:b.description,price:Number(b.price),oldPrice:b.oldPrice?Number(b.oldPrice):null,image:b.image||null,categoryId:Number(b.categoryId),isActive:b.isActive!==false}})}
 @Patch('products/:id') update(@Param('id',ParseIntPipe) id:number,@Body() b:any){return this.prisma.product.update({where:{id},data:{title:b.title,description:b.description,price:b.price!==undefined?Number(b.price):undefined,oldPrice:b.oldPrice===null?null:b.oldPrice!==undefined?Number(b.oldPrice):undefined,image:b.image,isActive:b.isActive,categoryId:b.categoryId!==undefined?Number(b.categoryId):undefined}})}
 @Delete('products/:id') remove(@Param('id',ParseIntPipe) id:number){return this.prisma.product.update({where:{id},data:{isActive:false}})}
}
