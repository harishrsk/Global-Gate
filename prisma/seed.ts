import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const manager = await prisma.user.upsert({
    where: { email: 'manager@globalgate.ai' },
    update: {},
    create: {
      email: 'manager@globalgate.ai',
      password: hashedPassword,
      name: 'Lead Systems Architect',
      role: 'MANAGER',
    },
  });

  console.log({ manager });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
