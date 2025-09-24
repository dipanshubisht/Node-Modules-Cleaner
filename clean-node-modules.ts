import * as fs from "node:fs";
import * as path from "node:path";
import { rimraf } from "rimraf";

/**
 * Deletes all top-level node_modules folders in a given directory
 * "Top-level" means node_modules folders that are not contained within another node_modules folder
 * @param rootDir The directory to search for node_modules folders
 * @param testMode If true, will only list folders but not delete them
 */
export function cleanTopLevelNodeModules(
  rootDir: string,
  testMode = false
): void {
  // Ensure directory exists
  if (!fs.existsSync(rootDir)) {
    console.error(`Directory does not exist: ${rootDir}`);
    process.exit(1);
  }

  console.log(`Searching for top-level node_modules in: ${rootDir}`);
  if (testMode) {
    console.log("Running in TEST MODE - no files will be deleted");
  }

  // Array to store found node_modules folders
  const nodeModulesFolders: string[] = [];

  const ignoredDirs = [
    ".git",
    ".vscode",
    "dist",
    "build",
    "coverage",
    // Mac-specific folders
    "Applications",
    "Library",
    "System",
    "Users",
    ".Trash",
    "Pictures",
    // Other common folders to ignore
    "vendor",
    "tmp",
    "temp",
  ];

  // Find all node_modules folders
  function findNodeModules(
    dir: string,
    isInsideNodeModules: boolean = false
  ): void {
    // Skip ignored directories
    if (ignoredDirs.includes(path.basename(dir))) {
      return;
    }

    try {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        // Ignore dotfiles
        if (item.startsWith(".")) {
          continue;
        }

        const itemPath = path.join(dir, item);
        let isDirectory: boolean;

        try {
          isDirectory = fs.statSync(itemPath).isDirectory();
        } catch (err) {
          // Ignore errors (e.g., permission denied)
          console.error(`Could not stat ${itemPath}: ${err}`);
          continue;
        }

        if (isDirectory) {
          // If this is a node_modules directory and not inside another node_modules
          if (item === "node_modules" && !isInsideNodeModules) {
            nodeModulesFolders.push(itemPath);
            // Continue search inside, but mark that we're now inside a node_modules
            findNodeModules(itemPath, true);
          } else {
            // Continue search with the current isInsideNodeModules state
            findNodeModules(
              itemPath,
              isInsideNodeModules || item === "node_modules"
            );
          }
        }
      }
    } catch (err) {
      console.error(`Error reading directory ${dir}: ${err}`);
    }
  }

  // Start search
  findNodeModules(rootDir);

  // Delete found node_modules folders
  if (nodeModulesFolders.length === 0) {
    console.log("No top-level node_modules folders found.");
    return;
  }

  console.log(
    `Found ${nodeModulesFolders.length} top-level node_modules folders:`
  );
  nodeModulesFolders.forEach((folder) => {
    console.log(`- ${folder}`);
  });

  // In test mode, just exit after listing folders
  if (testMode) {
    console.log("\nTest mode - no folders will be deleted.");
    return;
  }

  // Confirm deletion
  console.log("\nProceed with deletion? (y/n)");
  process.stdin.once("data", async (data) => {
    const input = data.toString().trim().toLowerCase();
    if (input === "y" || input === "yes") {
      console.log("Deleting folders...");

      let deletedCount = 0;
      let errorCount = 0;

      for (const folder of nodeModulesFolders) {
        try {
          await rimraf(folder);
          console.log(`✅ Deleted: ${folder}`);
          deletedCount++;
        } catch (err) {
          console.error(`❌ Failed to delete ${folder}: ${err}`);
          errorCount++;
        }
      }

      console.log(
        `\nDeletion complete: ${deletedCount} deleted, ${errorCount} failed`
      );
    } else {
      console.log("Operation cancelled.");
    }
    process.exit(0);
  });
}

// If this file is run directly, execute the function
if (import.meta.url === `file://${process.argv[1]}`) {
  // Check for test mode flag
  const testMode = process.argv.includes("--test");

  // Get directory from command line argument or use current directory
  // Filter out the --test flag if present
  const args = process.argv.filter((arg) => arg !== "--test");
  const targetDir = args[2] || process.cwd();

  cleanTopLevelNodeModules(targetDir, testMode);
}
