---
description: Validates a .umap file against the Zod schemas in src/umap-file-schema/. Accepts an optional file path argument; defaults to searching the project for *.umap files. Reports any schema validation errors clearly.
---

Validate a `.umap` file against the project's Zod schemas.

## Find the file to validate

If the user provided a path, use that. Otherwise, find `.umap` files:

```bash
find . -name "*.umap" -not -path "*/node_modules/*" -not -path "*/.git/*"
```

If multiple files are found, ask the user which one to validate (or validate all of them).

## Run validation

Write a temporary validation script to `/tmp/validate-umap.ts` and execute it with tsx:

```typescript
import { readFileSync } from 'fs';
import { UMapSchema } from './src/umap-file-schema/umap-file-schema.js';

const filePath = process.argv[2];
const raw = JSON.parse(readFileSync(filePath, 'utf-8'));
const result = UMapSchema.safeParse(raw);

if (result.success) {
  console.log(`✓ ${filePath} is valid`);
  console.log(`  Layers: ${result.data.layers?.length ?? 0}`);
} else {
  console.error(`✗ ${filePath} has schema errors:`);
  console.error(JSON.stringify(result.error.format(), null, 2));
  process.exit(1);
}
```

Run it:
```bash
tsx /tmp/validate-umap.ts {filePath}
```

If the import path doesn't resolve (ESM module resolution), adjust the import to use the full
relative path from the project root.

## Report results

- For valid files: confirm validity, report layer count and feature counts per layer
- For invalid files: show each schema error with its path and message, suggest fixes