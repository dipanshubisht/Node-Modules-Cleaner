import * as fs from 'node:fs';
import * as path from 'node:path';
import { rimraf } from 'rimraf';

/**
 * Deletes all top-level node_modules folders in a given directory
 * "Top-level" means node_modules folders that are not contained within another node_modules folder
 */
function cleanTopLevelNodeModules(rootDir: string): void {
  // Ensure directory exists
  if (!fs.existsSync(rootDir)) {
    console.error(`Directory does not exist: ${rootDir}`);
    process.exit(1);
  }

  console.log(`Searching for top-level node_modules in: ${rootDir}`);
  const nodeModulesFolders: string[] = [];

  // Find all node_modules folders
  function findNodeModules(dir: string, isInsideNodeModules: boolean = false): void {
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const isDirectory = fs.statSync(itemPath).isDirectory();
        
        if (isDirectory) {
          // If this is a node_modules directory and not inside another node_modules
          if (item === 'node_modules' && !isInsideNodeModules) {
            nodeModulesFolders.push(itemPath);
            // Continue search inside, but mark that we're now inside a node_modules
            findNodeModules(itemPath, true);
          } else {
            // Continue search with the current isInsideNodeModules state
            findNodeModules(itemPath, isInsideNodeModules || item === 'node_modules');
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
    console.log('No top-level node_modules folders found.');
    return;
  }

  console.log(`Found ${nodeModulesFolders.length} top-level node_modules folders:`);
  nodeModulesFolders.forEach(folder => {
    console.log(`- ${folder}`);
  });

  // Confirm deletion
  console.log('\nProceed with deletion? (y/n)');
  process.stdin.once('data', async (data) => {
    const input = data.toString().trim().toLowerCase();
    if (input === 'y' || input === 'yes') {
      console.log('Deleting folders...');
      
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
      
      console.log(`\nDeletion complete: ${deletedCount} deleted, ${errorCount} failed`);
    } else {
      console.log('Operation cancelled.');
    }
    process.exit(0);
  });
}

// Get directory from command line argument or use current directory
const targetDir = process.argv[2] || process.cwd();
cleanTopLevelNodeModules(targetDir);