import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),       // 运行/查询：pooler 6543
    directUrl: env("DIRECT_URL"),   // 迁移：direct 5432
  },
});
