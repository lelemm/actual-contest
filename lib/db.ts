import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import * as schema from "../drizzle/schema"
import config from "./config"
import * as fs from "fs"
import * as path from "path"

// Get database path from config
const dbPath = config.get("database.path")

// Ensure the directory exists
const dbDir = path.dirname(dbPath)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// Initialize the database connection
const sqlite = new Database(dbPath)

// Enable foreign keys
sqlite.pragma("foreign_keys = ON")

// Initialize Drizzle ORM
export const db = drizzle(sqlite, { schema })

// Close database connection
export function closeDb() {
  sqlite.close()
}
