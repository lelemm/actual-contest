// This file is used by the Docker entrypoint script
// It's a CommonJS version of migrate.ts for better compatibility in Docker

const { drizzle } = require("drizzle-orm/better-sqlite3")
const { migrate } = require("drizzle-orm/better-sqlite3/migrator")
const Database = require("better-sqlite3")
const fs = require("fs")
const path = require("path")
import config from "../lib/config"

// Get database path from environment
const dbPath = config.get('database.path');

// Ensure the directory exists
const dbDir = path.dirname(dbPath)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

console.log(`Using database at: ${dbPath}`)

// Initialize the database connection
const sqlite = new Database(dbPath)

// Enable foreign keys
sqlite.pragma("foreign_keys = ON")

// Initialize Drizzle ORM
const db = drizzle(sqlite)

// Run migrations
console.log("Running migrations...")
migrate(db, { migrationsFolder: "./drizzle/migrations" })
console.log("Migrations completed successfully!")

// Close the database connection
sqlite.close()
