const { PrismaClient } = require("@prisma/client");

console.log("DB URL:", process.env.DATABASE_URL ? "DEFINED (len=" + process.env.DATABASE_URL.length + ")" : "UNDEFINED");

try {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    });
    console.log("Prisma initialized successfully");
} catch (e) {
    console.error("Prisma Init Failed:");
    console.error(e.message);
    console.error(JSON.stringify(e, null, 2));
}
