const fs = require("node:fs");
const path = require("node:path");

// Get command line arguments
const args = process.argv.slice(2);
console.log("args ", args);
const envFile = path.join(__dirname, "..", ".env");

// Extract environment and target from arguments
// Example: ts-node modify-env.js stag dai-viet-uni
const [environment, platform, cleanBuild] = args;

// Validate inputs
if (!environment) {
  console.error("Usage: ts-node modify-env.js <environment>");
  console.error("Example: ts-node modify-env.js stag dai-viet-uni");
  process.exit(1);
}

// Map short environment names to full names
const envMap = {
  dev: "development",
  stag: "staging",
  prod: "production",
};

try {
  // Read current .env file
  let envContent = fs.readFileSync(envFile, "utf8");

  // Update environment variable
  envContent = envContent.replace(
    /EXPO_PUBLIC_NODE_ENV=.*/,
    `EXPO_PUBLIC_NODE_ENV=${envMap[environment] || environment}`,
  );

  if (platform) {
    // Update platform variable
    envContent = envContent.replace(/PLATFORM=.*/, `PLATFORM=${platform}`);
  }

  if (cleanBuild) {
    // Update cleanBuild variable
    envContent = envContent.replace(
      /CLEAN_BUILD=.*/,
      `CLEAN_BUILD=${cleanBuild}`,
    );
  }

  // Write back to .env file
  fs.writeFileSync(envFile, envContent);

  console.log("✅ Successfully updated .env file:");
  console.log(`Environment: ${envMap[environment] || environment}`);
  console.log(`Platform: ${platform}`);
  console.log(`Clean Build: ${cleanBuild}`);
} catch (error) {
  console.error("❌ Error updating .env file:", error);
  process.exit(1);
}
