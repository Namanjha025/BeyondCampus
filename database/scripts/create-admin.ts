import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@beyondcampus.com'
  const password = 'adminpassword123' // User should change this
  
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    console.log('Admin user already exists')
    // Update to admin just in case
    await (prisma as any).user.update({
      where: { email },
      data: { role: 'ADMIN' }
    })
    console.log('Updated existing user to ADMIN role')
    return
  }

  const hashedPassword = bcrypt.hashSync(password, 12)

  const admin = await (prisma as any).user.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email,
      password: hashedPassword,
      role: 'ADMIN',
      onboardingCompleted: true
    }
  })

  console.log('Admin user created successfully:', admin.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
