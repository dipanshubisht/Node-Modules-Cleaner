# Node Modules Cleaner

A simple utility to find and delete all top-level `node_modules` folders in a directory tree.

## What it does

This tool:
1. Recursively searches a directory for all top-level `node_modules` folders
2. Lists all found folders
3. Asks for confirmation before deletion
4. Deletes the folders upon confirmation

"Top-level" means `node_modules` folders that are not contained within another `node_modules` folder.

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd node-modules-cleaner

# Install dependencies
npm install
```

## Usage

Run the cleaner on a specific directory:

```bash
npm run clean -- /path/to/directory
```

Or run it on the current directory:

```bash
npm run clean
```

## Examples

```bash
# Clean node_modules in your home directory
npm run clean -- ~/

# Clean node_modules in a specific project
npm run clean -- ~/projects/my-project/

# Clean node_modules in the current directory
npm run clean
```

## How it works

The script recursively traverses the directory structure, identifying all `node_modules` folders. It keeps track of whether it's already inside a `node_modules` folder to avoid deleting nested ones.

After finding all top-level `node_modules` folders, it displays them and asks for confirmation before deletion.

## License

MIT 