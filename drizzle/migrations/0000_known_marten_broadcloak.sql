CREATE TABLE `bug_fixes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pr_number` integer NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`developer_id` integer NOT NULL,
	`merged_at` integer NOT NULL,
	`complexity` text DEFAULT 'normal',
	`points` integer NOT NULL,
	`created_at` integer DEFAULT '"2025-04-17T12:31:15.765Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-04-17T12:31:15.765Z"' NOT NULL,
	FOREIGN KEY (`developer_id`) REFERENCES `developers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bug_fixes_pr_number_unique` ON `bug_fixes` (`pr_number`);--> statement-breakpoint
CREATE TABLE `developers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`github_id` text NOT NULL,
	`username` text NOT NULL,
	`avatar_url` text,
	`created_at` integer DEFAULT '"2025-04-17T12:31:15.764Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-04-17T12:31:15.764Z"' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `developers_github_id_unique` ON `developers` (`github_id`);--> statement-breakpoint
CREATE TABLE `leaderboard_cache` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`developer_id` integer NOT NULL,
	`timeframe` text NOT NULL,
	`rank` integer NOT NULL,
	`total_bugs` integer NOT NULL,
	`total_points` integer NOT NULL,
	`last_updated` integer DEFAULT '"2025-04-17T12:31:15.765Z"' NOT NULL,
	FOREIGN KEY (`developer_id`) REFERENCES `developers`(`id`) ON UPDATE no action ON DELETE no action
);
