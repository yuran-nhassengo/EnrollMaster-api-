import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: 'file:./dev.db', // caminho relativo ao projeto
  }),
});

async function main() {
  const email = 'admin@plataforma.com';
  const password = 'SuperSenhaSegura123';
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log('🌱 Iniciando Seed...');

  const superAdmin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  console.log(`✅ Super-Admin criado: ${superAdmin.email}`);
  console.log(`🔑 Senha padrão: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
