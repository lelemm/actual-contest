import type { Config } from "drizzle-kit";
import config from "./lib/config"

console.log('using db path:', config.get('database.path'));
export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: 'sqlite',
  dbCredentials: {
    url: config.get('database.path'),
  },
} satisfies Config;
