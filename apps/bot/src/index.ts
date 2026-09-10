import { Bot, Keyboard, Context } from 'grammy';
const token=process.env.BOT_TOKEN; const API=(process.env.API_URL||'http://localhost:3000').replace(/\/$/,'');
if(!token) throw new Error('BOT_TOKEN is not set');
const bot=new Bot(token);
const admins=new Set((process.env.ADMIN_TELEGRAM_IDS||'').split(',').map(x=>x.trim()).filter(Boolean));
async function api(path:string,options?:RequestInit){const r=await fetch(API+path,{...options,headers:{'content-type':'application/json',...(options?.headers||{})}}); if(!r.ok) throw new Error(await r.text()); return r.json();}
async function ensureUser(ctx:Context,phone?:string){const u=ctx.from!; return api('/users/upsert',{method:'POST',body:JSON.stringify({telegramId:String(u.id),firstName:u.first_name,lastName:u.last_name,username:u.username,phone})})}
bot.command('start',async ctx=>{await ctx.reply('Assalomu alaykum! TEGEN do\'koniga xush kelibsiz.\n\nDavom etish uchun telefon raqamingizni yuboring:',{reply_markup:new Keyboard().requestContact('📱 Telefon raqamimni yuborish').resized().oneTime()});});
bot.on('message:contact',async ctx=>{const c=ctx.message.contact; if(c.user_id&&c.user_id!==ctx.from.id){await ctx.reply('Iltimos, o\'zingizning telefon raqamingizni yuboring.');return;} try{await api('/users/upsert',{method:'POST',body:JSON.stringify({telegramId:String(ctx.from.id),firstName:ctx.from.first_name,lastName:ctx.from.last_name,username:ctx.from.username,phone:c.phone_number})});}catch{} await ctx.reply('✅ Telefon raqamingiz saqlandi.\nEndi TEGEN Mini App orqali xarid qilishingiz mumkin.',{reply_markup:new Keyboard().text('🛍 Do\'konni ochish').resized()});});
bot.on('message:text',async ctx=>{if(ctx.message.text==='🛍 Do\'konni ochish'){const url=process.env.MINI_APP_URL;if(url) return ctx.reply('🛍 Do\'konni ochish:',{reply_markup:{inline_keyboard:[[{text:'Do\'konni ochish',web_app:{url}}]]}});return ctx.reply('MINI_APP_URL sozlanmagan.');}
 if(admins.has(String(ctx.from.id)) && ctx.message.text==='/orders') {const orders=await api('/orders'); return ctx.reply(orders.slice(0,10).map((o:any)=>`#${o.orderNumber} — ${o.total.toLocaleString()} so'm — ${o.status}`).join('\n')||'Buyurtmalar yo\'q');}
 try{const u=await api('/messages/incoming',{method:'POST',body:JSON.stringify({telegramId:String(ctx.from.id),text:ctx.message.text})}); if(!u) await ctx.reply('Xabaringiz qabul qilindi.');}catch{await ctx.reply('Xabaringiz qabul qilindi.');}
});
bot.start(); console.log('TEGEN bot ishga tushdi');
