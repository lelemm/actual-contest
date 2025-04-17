import convict from "convict"
import * as fs from "fs"
import * as path from "path"

const config = convict({
  github: {
    token: {
      doc: "GitHub token for authentication",
      format: String,
      default: "",
      env: "GITHUB_TOKEN",
    },
    owner: {
      doc: "GitHub repository owner",
      format: String,
      default: "actualbudget",
      env: "GITHUB_OWNER",
    },
    repo: {
      doc: "GitHub repository name",
      format: String,
      default: "actual",
      env: "GITHUB_REPO",
    },
  },
  database: {
    path: {
      doc: "Path to SQLite database",
      format: String,
      default: "./data/db.sqlite",
      env: "DATABASE_PATH",
    },
  },
  competition: {
    startDate: {
      doc: "Competition start date (ISO format)",
      format: String,
      default: "2025-03-24T00:00:00Z",
      env: "COMPETITION_START_DATE",
    },
    endDate: {
      doc: "Competition end date (ISO format)",
      format: String,
      default: "2025-04-24T23:59:59Z",
      env: "COMPETITION_END_DATE",
    },
    pointsPerBug: {
      doc: "Points awarded per bug fix",
      format: Number,
      default: 10,
      env: "POINTS_PER_BUG",
    },
    bonusPoints: {
      doc: "Bonus points for special conditions",
      format: Number,
      default: 5,
      env: "BONUS_POINTS",
    },
  },
})

// Load optional config.json
const configPath = path.resolve(process.cwd(), "config.json")
if (fs.existsSync(configPath)) {
  config.loadFile(configPath)
  console.log("Loaded configuration from config.json")
}

// Perform validation (throws if invalid)
config.validate({ allowed: "strict" })

export default config
