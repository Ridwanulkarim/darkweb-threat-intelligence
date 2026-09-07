import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Auto-append sslmode=require for remote cloud databases (Render, Supabase, Neon)
if (process.env.DATABASE_URL) {
  const url = process.env.DATABASE_URL;
  if (!url.includes("sslmode=") && !url.includes("localhost") && !url.includes("127.0.0.1")) {
    const sep = url.includes("?") ? "&" : "?";
    process.env.DATABASE_URL = `${url}${sep}sslmode=require`;
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL || env("DATABASE_URL"),
  },
});
