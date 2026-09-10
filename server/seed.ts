import { PrismaClient } from '@prisma/client';
const prisma=new PrismaClient();
const data=[['Telefonlar','telefonlar'],['Elektronika','elektronika'],['Kiyim','kiyim'],['Poyabzallar','poyabzallar'],['Uy-ro‘zg‘or','uy-rozgor'],['Go‘zallik','gozallik'],['Bolalar','bolalar'],['Aksessuarlar','aksessuarlar']];
async function main(){for(const [name,slug] of data){await prisma.category.upsert({where:{slug},update:{name,isActive:true},create:{name,slug}})}const cats=await prisma.category.findMany(); const phone=cats.find(x=>x.slug==='telefonlar')!; const shoe=cats.find(x=>x.slug==='poyabzallar')!; const demo=[{title:'Smartfon TEGEN X1',price:2499000,oldPrice:2899000,categoryId:phone.id},{title:'Sport krossovka',price:399000,oldPrice:499000,categoryId:shoe.id}];for(const p of demo){await prisma.product.upsert({where:{slug:p.title.toLowerCase().replace(/\s+/g,'-')},update:p,create:{...p,slug:p.title.toLowerCase().replace(/\s+/g,'-')}})}}
main().finally(()=>prisma.$disconnect());
