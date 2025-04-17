import { sql } from "drizzle-orm"
import { sqliteTable, text, integer, unique } from "drizzle-orm/sqlite-core"

// Developers table
export const developers = sqliteTable("developers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  githubId: text("github_id").notNull().unique(),
  username: text("username").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`).$onUpdateFn(() => new Date()),
})

// Bug fixes (PRs) table
export const bugFixes = sqliteTable("bug_fixes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  prNumber: integer("pr_number").notNull().unique(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  developerId: integer("developer_id")
    .notNull()
    .references(() => developers.id),
  mergedAt: integer("merged_at", { mode: "timestamp" }).notNull(),
  complexity: text("complexity").default("normal"), // 'simple', 'normal', 'complex'
  points: integer("points").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`).$onUpdateFn(() => new Date()),
})

// Leaderboard cache table
export const leaderboardCache = sqliteTable("leaderboard_cache", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  developerId: integer("developer_id")
    .notNull()
    .references(() => developers.id),
  timeframe: text("timeframe").notNull(), // 'day', 'week', 'all'
  rank: integer("rank").notNull(),
  totalBugs: integer("total_bugs").notNull(),
  totalPoints: integer("total_points").notNull(),
  lastUpdated: integer("last_updated", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`).$onUpdateFn(() => new Date()),
})

// Composite unique constraint for leaderboard cache
export const leaderboardCacheIndex = unique("leaderboard_cache_unique_idx").on(
  leaderboardCache.developerId,
  leaderboardCache.timeframe
)

// Types for our schema
export type Developer = typeof developers.$inferSelect
export type NewDeveloper = typeof developers.$inferInsert

export type BugFix = typeof bugFixes.$inferSelect
export type NewBugFix = typeof bugFixes.$inferInsert

export type LeaderboardEntry = typeof leaderboardCache.$inferSelect
export type NewLeaderboardEntry = typeof leaderboardCache.$inferInsert
