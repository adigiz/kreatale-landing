import { config } from "dotenv";
import { db, users } from "../src/lib/cms/db";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

// Load environment variables
config({ path: ".env.local" });

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || "Admin User";

  if (!email || !password) {
    console.error("Usage: npm run create-admin <email> <password> [name]");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Password must be at least 8 characters long");
    process.exit(1);
  }

  try {
    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      console.error(`User with email ${email} already exists`);
      process.exit(1);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        name,
        passwordHash,
        role: "super_admin",
      })
      .returning();

    console.log(`✅ Admin user created successfully!`);
    console.log(`   Email: ${newUser.email}`);
    console.log(`   Name: ${newUser.name}`);
    console.log(`   Role: ${newUser.role}`);
    console.log(`\n   You can now login at /admin/login`);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

createAdmin();
