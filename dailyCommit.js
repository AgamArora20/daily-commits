const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const makeDailyCommit = () => {
  try {
    // Current directory or GITHUB_WORKSPACE
    const repoPath = process.env.GITHUB_WORKSPACE || process.cwd();
    process.chdir(repoPath);

    console.log(`Working in directory: ${process.cwd()}`);

    // Ensure we're on the main branch
    // Actions usually checkout the right branch, but this adds robustness
    try {
      execSync("git checkout main", { stdio: 'inherit' });
      execSync("git pull origin main", { stdio: 'inherit' });
    } catch (e) {
      console.log("Pulling failed, attempting reset...");
      execSync("git fetch origin main", { stdio: 'inherit' });
      execSync("git reset --hard origin/main", { stdio: 'inherit' });
    }

    // Create a unique message with today's date and time
    const now = new Date();
    const dateStr = now.toISOString();
    const message = `Daily automated commit: ${dateStr}`;

    // Append to a permanent log file instead of just a temp file
    // This makes the contribution history visible in the repo itself
    const logFilePath = path.join(repoPath, "contribution_log.txt");
    fs.appendFileSync(logFilePath, `${dateStr} - ${message}\n`);

    // Stage, commit, and push the changes
    execSync("git add contribution_log.txt");
    
    // Check if there are changes to commit (safety check)
    const status = execSync("git status --porcelain").toString().trim();
    if (status) {
      execSync(`git commit -m "${message}"`);
      console.log("Commit created. Pushing to origin...");
      execSync("git push origin main");
      console.log("✅ Successfully pushed daily commit!");
    } else {
      console.log("No changes detected, skipping commit.");
    }

  } catch (error) {
    console.error("❌ Error during daily commit:", error.message);
    process.exit(1);
  }
};

// Run the function
makeDailyCommit();
