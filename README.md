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

### Global Installation (Recommended)

```bash
# Install globally
npm install -g @dipanshubisht/node-modules-cleaner
```

After installing globally, you can use the command `node-modules-cleaner` from anywhere.

### Local Installation

```bash
# Install locally in a project
npm install @dipanshubisht/node-modules-cleaner
```

### From Source

```bash
# Clone the repository
git clone https://github.com/dipanshubisht/Node-Mudules-Cleaner.git
cd Node-Mudules-Cleaner

# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

### If installed globally:

```bash
# Clean node_modules in a specific directory
node-modules-cleaner /path/to/directory

# Clean node_modules in the current directory
node-modules-cleaner
```

### If installed locally or from source:

```bash
# Using npm script on a specific directory
npm run clean -- /path/to/directory

# Using npm script on the current directory
npm run clean
```

## Examples

```bash
# Clean node_modules in your home directory
node-modules-cleaner ~/

# Clean node_modules in a specific project
node-modules-cleaner ~/projects/my-project/

# Clean node_modules in the current directory
node-modules-cleaner
```

## How it works

The script recursively traverses the directory structure, identifying all `node_modules` folders. It keeps track of whether it's already inside a `node_modules` folder to avoid deleting nested ones. The script also ignores dotfiles (e.g. `.git`, `.vscode`) and the `.trash` folder.

After finding all top-level `node_modules` folders, it displays them and asks for confirmation before deletion.

## License

MIT