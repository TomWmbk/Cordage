import { db } from './lib/db'
import bcrypt from 'bcryptjs'

async function main() {
    const username = process.argv[2]?.trim().toLowerCase()
    const password = process.argv[3]

    if (!username || !password) {
        console.error('Usage: npx tsx create-user.ts <username> <password>')
        process.exit(1)
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
        where: { username }
    })

    if (existingUser) {
        console.error(`User "${username}" already exists`)
        process.exit(1)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await db.user.create({
        data: {
            username,
            password: hashedPassword
        }
    })

    console.log(`✅ User "${user.username}" created successfully!`)
    console.log(`ID: ${user.id}`)

    await db.$disconnect()
}

main().catch((error) => {
    console.error('Error:', error)
    process.exit(1)
})
