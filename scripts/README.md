# Scripts

## update-timestamp.js

Automatically updates the version timestamp in `Lite app.html` to reflect when code changes were made.

### Usage

**Manual execution:**
```bash
node scripts/update-timestamp.js
```

**Automatic execution:**
The timestamp is automatically updated via a git pre-commit hook whenever you commit changes to `Lite app.html`.

### What it does

- Reads `Lite app.html`
- Updates the `staticDate` and `staticTime` variables with the current date/time
- Format: `dd/mm/yyyy HH:MM:SS` (e.g., `12/12/2025 09:09:09`)
- Writes the updated file back

### Git Hook

A pre-commit hook has been set up at `.git/hooks/pre-commit` that automatically runs this script when `Lite app.html` is being committed. This ensures the timestamp always reflects when code changes are made.
