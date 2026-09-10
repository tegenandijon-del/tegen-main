# TEGEN

TEGEN — Telegram Mini App + NestJS API + PostgreSQL + Telegram bot.

## Ishga tushirish

1. PostgreSQL: `docker compose up -d db`
2. `cp server/.env.example server/.env` va qiymatlarni kiriting.
3. `npm install`
4. `npm run db:push`
5. `npm --workspace server run db:seed`
6. API: `npm run dev:api`
7. Mini App: `npm run dev:web`
8. Admin: `npm run dev:admin`
9. Bot: `BOT_TOKEN=... API_URL=http://localhost:3000 MINI_APP_URL=https://... npm --workspace apps/bot run start`

## Asosiy tizimlar

- PostgreSQL yagona baza: katalog, savat uchun klient persistence, foydalanuvchi va buyurtmalar.
- Mahsulot: narx, eski narx/chegirma, rasm, kategoriya, faol/nofaol.
- Savat: mahsulot, rasm, nom, narx, `− 1 +`, jami va buyurtma berish.
- Buyurtma statuslari: `NEW → ACCEPTED → PREPARING → READY`, yoki `CANCELLED`. Yetkazib berish statuslari yo‘q.
- Telegram `/start`: telefon raqamini contact tugmasi orqali olish.
- Admin: katalog, kategoriya, buyurtma statuslari, worker va proposal tasdiqlashi, asosiy statistika.
- Worker: faqat biriktirilgan kategoriya bo‘yicha mahsulot taklifi yuboradi; admin tasdiqlamaguncha live katalog o‘zgarmaydi. Taklifda nom, narx, rasm va tahlil maydoni bor.
- Mijoz-admin xabarlari API orqali order bilan bog‘lanadi va admin javobi Telegram orqali yuboriladi.

## Muhim environment

`DATABASE_URL`, `ADMIN_TOKEN`, `BOT_TOKEN`, `ADMIN_TELEGRAM_IDS`, `MINI_APP_URL`, `VITE_API_URL`.

Productionda `ADMIN_TOKEN`ni kuchli maxfiy qiymatga almashtiring.
