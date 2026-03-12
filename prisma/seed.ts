import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL ?? 'postgresql://vibecoder:vibecoder@localhost:5432/app'
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  const hashedPassword = await bcrypt.hash('password123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'user',
    },
  })

  console.log('Seeded users:', { admin: admin.email, user: user.email })
  console.log('Default password: password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
