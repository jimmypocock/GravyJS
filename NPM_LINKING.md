# NPM Linking for GravyJS Development

This document outlines how to set up npm linking between the OtherProject app and the GravyJS package for simultaneous development.

## What is NPM Linking?

NPM linking creates symbolic links that allow you to develop and test a local npm package alongside your main project without publishing to npm. Changes in the linked package are immediately reflected in the consuming project.

## Setup Process (One-time)

### 1. Create Global Symlink for GravyJS

Navigate to the GravyJS project and create a global link:

```bash
cd ../GravyJS
npm link
```

This registers GravyJS globally on your system.

### 2. Link GravyJS in OtherProject

Navigate back to OtherProject and link to the global GravyJS:

```bash
cd ~/Path/To/~OtherProject
npm link gravyjs
```

This creates a symlink in `node_modules/gravyjs` pointing to your local GravyJS development folder.

### 3. Install Concurrently (if not already installed)

```bash
npm install --save-dev concurrently
```

### 4. Add Package.json Scripts

Add these scripts to your `package.json` for convenient development:

```json
{
  "scripts": {
    "dev:both": "concurrently \"npm run dev\" \"npm run dev:gravy\"",
    "dev:gravy": "cd ../GravyJS && npm run dev",
    "build:both": "npm run build:gravy && npm run build",
    "build:gravy": "cd ../GravyJS && npm run build"
  }
}
```

## Daily Development Workflow

**The linking setup is persistent** - you only need to do the setup process once. After that:

### Starting Development

```bash
npm run dev:both
```

This starts both projects simultaneously with file watching.

### Building Both Projects

```bash
npm run build:both
```

This builds GravyJS first, then OtherProject.

## Important Notes

- **Links persist**: Once set up, the npm link remains active across restarts
- **No republishing needed**: Changes in GravyJS are immediately available in OtherProject
- **Version independence**: You can develop both packages without version constraints
- **Clean uninstall**: Use `npm unlink gravyjs` in OtherProject to remove the link

## Troubleshooting

### If linking stops working:

1. Check if GravyJS global link exists:

   ```bash
   npm list -g --depth=0 | grep gravyjs
   ```

2. Re-create the link if missing:
   ```bash
   cd ../GravyJS && npm link
   cd ~/Path/To/~OtherProject && npm link gravyjs
   ```

### If you see "Module not found" errors:

- Ensure GravyJS has a proper `main` field in its `package.json`
- Verify the package name matches exactly between projects
- Try rebuilding both projects: `npm run build:both`

## Unlinking (when done with development)

To remove the link and use the published npm version:

```bash
npm unlink gravyjs
npm install gravyjs
```
