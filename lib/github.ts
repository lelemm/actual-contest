import { Octokit } from "@octokit/rest";
import config from "./config";
import { db } from "./db";
import {
  developers,
  bugFixes,
  leaderboardCache,
  type Developer,
  type BugFix,
} from "../drizzle/schema";
import { eq, gte, sql, count, sum } from "drizzle-orm";

// Initialize Octokit with GitHub token
const octokit = new Octokit({
  auth: config.get("github.token"),
});

// GitHub repository details
const owner = config.get("github.owner");
const repo = config.get("github.repo");

// Competition dates
const startDate = new Date(config.get("competition.startDate"));
const endDate = new Date(config.get("competition.endDate"));

// Points configuration
const pointsPerBug = config.get("competition.pointsPerBug");
//const bonusPoints = config.get("competition.bonusPoints");

// Function to fetch bug fix PRs from GitHub
export async function fetchBugFixPRs() {
  try {
    // Fetch merged PRs with the bug label
    const { data: prs } = await octokit.search.issuesAndPullRequests({
      q: `repo:${owner}/${repo} is:pr is:merged merged:${startDate.toISOString()}..${endDate.toISOString()}`,
      per_page: 100,
    });

    console.log(`Found ${prs.items.length} bug fix PRs`);

    // Process each PR
    for (const pr of prs.items) {
      // Get PR details
      const { data: prDetails } = await octokit.pulls.get({
        owner,
        repo,
        pull_number: pr.number,
      });

      if (
        prDetails.author_association === "MEMBER" ||
        prDetails.user.login === "dependabot[bot]" ||
        prDetails.user.login === "github-actions[bot]"
      ) {
        continue;
      }

      if (
        !doesPRCloseAnyIssue(
          owner as unknown as string,
          repo as unknown as string,
          pr.number
        )
      )
        continue;

      if(!pr || !pr.user) continue;

      // Get or create developer
      let developer = await getDeveloperByGithubId(String(pr.user.id));

      if (!developer) {
        developer = await createDeveloper({
          githubId: String(pr.user.id),
          username: pr.user.login,
          avatarUrl: pr.user.avatar_url,
        });
      }

      // Calculate complexity and points
      // const complexity = calculateComplexity(prDetails);
      const complexity = "normal";
      const points = pointsPerBug; //calculatePoints(complexity);

      // Save bug fix
      const mergedAt = new Date(prDetails?.merged_at ?? new Date()).getTime();
      console.log(mergedAt);
      await saveBugFix({
        prNumber: pr.number,
        title: pr.title,
        url: pr.html_url,
        developerId: developer.id,
        mergedAt: mergedAt,
        complexity,
        points,
      });
    }

    // Update leaderboard cache
    await updateLeaderboardCache();

    return {
      success: true,
      message: `Processed ${prs.items.length} bug fix PRs`,
    };
  } catch (error) {
    console.error("Error fetching bug fix PRs:", error);
    return { success: false, message: `Error: ${error}` };
  }
}

// Helper function to get developer by GitHub ID
async function getDeveloperByGithubId(
  githubId: string
): Promise<Developer | undefined> {
  const result = await db
    .select()
    .from(developers)
    .where(eq(developers.githubId, githubId))
    .limit(1);
  return result[0];
}

// Helper function to create a new developer
async function createDeveloper(data: {
  githubId: string;
  username: string;
  avatarUrl: string;
}): Promise<Developer> {
  const result = await db
    .insert(developers)
    .values({
      githubId: data.githubId,
      username: data.username,
      avatarUrl: data.avatarUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return result[0];
}

// Helper function to save a bug fix
async function saveBugFix(data: {
  prNumber: number;
  title: string;
  url: string;
  developerId: number;
  mergedAt: number;
  complexity: string;
  points: number;
}): Promise<BugFix> {
  // Check if PR already exists
  const existingPR = await db
    .select()
    .from(bugFixes)
    .where(eq(bugFixes.prNumber, data.prNumber))
    .limit(1);

  if (existingPR.length > 0) {
    // Update existing PR
    const result = await db
      .update(bugFixes)
      .set({
        title: data.title,
        url: data.url,
        developerId: data.developerId,
        mergedAt: new Date(data.mergedAt),
        complexity: data.complexity,
        points: data.points,
        updatedAt: new Date(),
      })
      .where(eq(bugFixes.prNumber, data.prNumber))
      .returning();

    return result[0];
  } else {
    // Insert new PR
    const result = await db
      .insert(bugFixes)
      .values({
        prNumber: data.prNumber,
        title: data.title,
        url: data.url,
        developerId: data.developerId,
        mergedAt: new Date(data.mergedAt),
        complexity: data.complexity,
        points: data.points,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return result[0];
  }
}

// // Helper function to calculate complexity based on PR details
// function calculateComplexity(pr: any): string {
//   // Simple algorithm based on changes
//   const changedFiles = pr.changed_files || 0;
//   const additions = pr.additions || 0;
//   const deletions = pr.deletions || 0;

//   // Total changes
//   const totalChanges = additions + deletions;

//   if (changedFiles > 10 || totalChanges > 500) {
//     return "complex";
//   } else if (changedFiles > 3 || totalChanges > 100) {
//     return "normal";
//   } else {
//     return "simple";
//   }
// }

// Helper function to calculate points based on complexity
// function calculatePoints(complexity: string): number {
//   switch (complexity) {
//     case "complex":
//       return pointsPerBug + bonusPoints * 2;
//     case "normal":
//       return pointsPerBug + bonusPoints;
//     case "simple":
//     default:
//       return pointsPerBug;
//   }
// }

// Function to update the leaderboard cache
export async function updateLeaderboardCache() {
  try {
    // Clear existing cache
    await db.delete(leaderboardCache);

    // Calculate all-time leaderboard
    console.log("updating all");
    await updateTimeframeLeaderboard("all");

    // Calculate weekly leaderboard
    console.log("updating week");
    await updateTimeframeLeaderboard("week");

    // Calculate daily leaderboard
    console.log("updating day");
    await updateTimeframeLeaderboard("day");

    return { success: true, message: "Leaderboard cache updated successfully" };
  } catch (error) {
    console.error("Error updating leaderboard cache:", error);
    return { success: false, message: `Error: ${error}` };
  }
}

// Helper function to update leaderboard for a specific timeframe
async function updateTimeframeLeaderboard(timeframe: "all" | "week" | "day") {
  // Calculate date range based on timeframe
  const now = new Date();
  let startDateTime: number;

  if (timeframe === "day") {
    // Last 24 hours
    startDateTime = new Date(now.getTime() - 24 * 60 * 60 * 1000).getTime();
  } else if (timeframe === "week") {
    // Last 7 days
    startDateTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime();
  } else {
    // All time (competition start date)
    startDateTime = startDate.getTime();
  }

  // Query to get developer stats for the timeframe
  const stats = await db
    .select({
      developerId: bugFixes.developerId,
      totalBugs: count(bugFixes.id).as("totalBugs"),
      totalPoints: sum(bugFixes.points).as("totalPoints"),
    })
    .from(bugFixes)
    .where(gte(bugFixes.mergedAt, new Date(startDateTime)))
    .groupBy(bugFixes.developerId)
    .orderBy(sql`totalPoints DESC`);

  // Insert into leaderboard cache with ranks
  let currentRank = 1;
  let lastPoints: number | null = null;

  for (let i = 0; i < stats.length; i++) {
    const stat = stats[i];
    const points = Number(stat.totalPoints);

    if (lastPoints !== null && points < lastPoints) {
      currentRank++;
    }

    await db.insert(leaderboardCache).values({
      developerId: stat.developerId,
      timeframe,
      rank: currentRank,
      totalBugs: Number(stat.totalBugs),
      totalPoints: points,
      lastUpdated: new Date(),
    });

    lastPoints = points;
  }
}

// Function to get leaderboard data
export async function getLeaderboard(
  timeframe: "all" | "week" | "day" = "all"
) {
  try {
    // Join leaderboard cache with developers to get usernames and avatars
    const leaderboardData = await db
      .select({
        rank: leaderboardCache.rank,
        developerId: leaderboardCache.developerId,
        username: developers.username,
        avatarUrl: developers.avatarUrl,
        totalBugs: leaderboardCache.totalBugs,
        totalPoints: leaderboardCache.totalPoints,
      })
      .from(leaderboardCache)
      .innerJoin(developers, eq(leaderboardCache.developerId, developers.id))
      .where(eq(leaderboardCache.timeframe, timeframe))
      .orderBy(leaderboardCache.rank);

    return leaderboardData.map((entry) => ({
      rank: entry.rank,
      name: entry.username,
      avatar: entry.avatarUrl || `/placeholder.svg?height=40&width=40`,
      bugs: entry.totalBugs,
      points: entry.totalPoints,
    }));
  } catch (error) {
    console.error("Error getting leaderboard data:", error);
    return [];
  }
}

export async function doesPRCloseAnyIssue(
  owner: string,
  repo: string,
  prNumber: number
): Promise<boolean> {
  const query = `
    query($owner: String!, $repo: String!, $prNumber: Int!) {
      repository(owner: $owner, name: $repo) {
        pullRequest(number: $prNumber) {
          closingIssuesReferences(first: 1) {
            totalCount
          }
        }
      }
    }
  `;

  const result = await octokit.graphql<{
    repository: {
      pullRequest: {
        closingIssuesReferences: {
          totalCount: number;
        };
      };
    };
  }>(query, { owner, repo, prNumber });

  return result.repository.pullRequest.closingIssuesReferences.totalCount > 0;
}
