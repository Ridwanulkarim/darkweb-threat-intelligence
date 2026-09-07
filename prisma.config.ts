import "dotenv/config";
import { defineConfig, env } from "prisma/config";

let dbUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/threat_intelligence_db";
if (process.env.DATABASE_URL) {
  const url = process.env.DATABASE_URL;
  if (!url.includes("sslmode=") && !url.includes("localhost") && !url.includes("127.0.0.1")) {
    const sep = url.includes("?") ? "&" : "?";
    dbUrl = `${url}${sep}sslmode=require`;
    process.env.DATABASE_URL = dbUrl;
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: dbUrl,
  },
});
