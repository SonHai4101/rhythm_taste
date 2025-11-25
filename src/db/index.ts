// Import from the generated prisma client
import { PrismaClient } from "../generated/prisma/client";

// Driver Adapter for Postgres
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export default prisma
