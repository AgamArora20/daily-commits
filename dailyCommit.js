const { execSync } = require("child_process");
const fs = require("fs");

const makeDailyCommit = () => {
  try {
    // Current directory is used by default in GitHub Actions
    const repoPath = process.env.GITHUB_WORKSPACE || process.cwd();
    process.chdir(repoPath);

    // Ensure we're on the main branch
    // (GITHUB ACTIONS handles checkout automagically, but this keeps local usage safe)
    execSync("git checkout main", { stdio: 'inherit' });
    execSync("git fetch origin main", { stdio: 'inherit' });
    execSync("git reset --hard origin/main", { stdio: 'inherit' });

    // Create a unique message with today's date and time
    const date = new Date().toISOString();
    const message = `Daily commit for ${date}`;

    // Write a new file with the updated content
    fs.writeFileSync("temp.txt", message);

    // Stage, commit, and push the changes
    execSync("git add temp.txt");
    execSync(`git commit -m "${message}"`);
    execSync("git push origin main");

    // Clean up the temporary file after a successful push
    fs.unlinkSync("temp.txt");
  } catch (error) {
    console.error("Error during daily commit:", error);
  }
};

// Run the function
makeDailyCommit();
