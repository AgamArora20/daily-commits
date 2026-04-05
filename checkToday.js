const { execSync } = require("child_process");

const checkToday = () => {
  try {
    console.log("Fetching latest from origin...");
    execSync("git fetch origin main");

    // Get the timestamp of the last commit on origin/main
    const lastCommitDate = execSync("git log -1 origin/main --format=%as").toString().trim();
    
    // Get today's date in local time YYYY-MM-DD
    const today = new Date().toLocaleDateString('en-CA'); // 'en-CA' gives YYYY-MM-DD format

    console.log(`Today's date (local): ${today}`);
    console.log(`Last commit date (on GitHub): ${lastCommitDate}`);

    if (lastCommitDate === today) {
      console.log("✅ Success: A commit for today was found on GitHub!");
      process.exit(0);
    } else {
      console.log("❌ Error: No commit for today found on GitHub yet.");
      process.exit(1);
    }
  } catch (error) {
    console.error("Error checking commits:", error.message);
    process.exit(1);
  }
};

checkToday();
