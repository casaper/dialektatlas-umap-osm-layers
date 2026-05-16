# Dialektatlas uMap OSM Layers

## Project Purpose

Convert Swiss-German dialect research data from [Dialektatlas](https://dialektatlas.ch/) into
interactive map overlays on [uMap](https://umap.osm.ch/) (OpenStreetMap). The source data comes from
a QGIS project built by the Dialektatlas researchers. Each word has geographic survey data showing
which dialect variant was used in which Swiss region, across three age groups.

POC: [Zwiebel map](https://umap.osm.ch/en/map/dialaktatlas-zwiebel_11727#10/46.870519/8.560410)

## Critical Constraints

**NEVER explore `dialektatlas-data-source/`** without explicit user permission. It is a separate 3GB
QGIS git repository. Reading it will exhaust context. Always ask first.

**Never read `src/source_data/samples.json`** — it is 47 MB.

## Environment & Tooling

### direnv

A `.envrc` hook loads `DATABASE_URL` from `.env.local` and adds `node_modules/.bin` to `PATH`.
The `.claude/hooks/direnv-load.sh` hook injects direnv exports at session start, so `DATABASE_URL`
and project binaries (`prisma`, `tsx`, `eslint`, etc.) are available directly in every Bash tool call.

### Package manager — always pnpm

Use `pnpm`, `pnpx`, or `pnpm dlx`. Never use `npx`.

```bash
pnpx prettier --write src/   # ✓
pnpm dlx some-tool           # ✓
npx prettier ...             # ✗ wrong
```

### Running prisma commands with DATABASE_URL

If direnv hasn't injected `DATABASE_URL` into a Bash tool call, source it inline:

```bash
set -o allexport; source .env.local; set +o allexport; prisma <subcommand>
```

This works for any non-interactive prisma command (`generate`, `migrate deploy`,
`migrate status`, `studio`, etc.).

### Database migrations — always backup first

**Before running any migration**, take a backup:

```bash
pnpm run db:backup           # creates prisma/db_backups/<timestamp>.sql.gz
```

**NEVER write migration SQL files by hand. This is strictly forbidden.** Always use
`prisma migrate dev` — it generates the correct SQL from the schema diff and registers the
migration in Prisma's history. Hand-written migrations corrupt the migration history and are
permanently forbidden, no exceptions.

`prisma migrate dev` is interactive and cannot run in Claude Code's non-TTY Bash tool. Ask the
user to run it themselves with `! prisma migrate dev --name <migration_name>` in the prompt.

Migration workflow:
```bash
pnpm run db:backup
# then ask the user to run:
! prisma migrate dev --name <migration_name>
# then regenerate the client (non-interactive, safe to run in Bash tool):
set -o allexport; source .env.local; set +o allexport; prisma generate
```

If a `--create-only` migration is needed for custom SQL edits:
```bash
# ask the user to run:
! prisma migrate dev --create-only --name <migration_name>
# edit prisma/migrations/<timestamp>_<name>/migration.sql
set -o allexport; source .env.local; set +o allexport; prisma migrate deploy
set -o allexport; source .env.local; set +o allexport; prisma generate
```

## Data Pipeline

```
src/source_data/word_mapping_csvs/   ← QGIS CSV exports (input, ~1100 files)
         │
         ▼  pnpm run word-map
         │    Word rows upserted to DB (wordKey, csvRefs)
         ▼  pnpm run transform-csvs
         │    Site + SurveyRecord rows upserted to DB
         ▼  pnpm run pdf-extract
         │    Word rows updated with pdfLabel, pdfStartPage, sdsPage, altJungPage
         │    word_pdf_pages/{word}/ extracted as lossless PDFs
         ▼  pnpm run scan-pdf-pages
         │    Word rows updated with textLabel, qrUrl
         ▼  pnpm run import-regions
         │    Site rows updated with lat, lng, geometry (GeoJSON), sdsCode, canton
         ▼  pnpm run resolve-audio-urls
         │    Word.audioUrl resolved from qrUrl redirect; WordAudios rows created
         ▼  pnpm run crawl-audio
              WordAudios updated with title/pageNumber; SiteWordAudio rows created
         │
         ▼  (NEXT MILESTONE — not yet built)
output/{word}.umap                           ← uMap layer file for upload
```

Run the full pipeline end-to-end:

```bash
pnpm run pipeline   # word-map → transform-csvs → pdf-extract → scan-pdf-pages → import-regions
```

`resolve-audio-urls` and `crawl-audio` are not yet wired into the pipeline script.

## Running Commands

```bash
pnpm run word-map             # CSV files → Word rows in DB
pnpm run transform-csvs       # Word rows → Site + SurveyRecord rows
pnpm run pdf-extract          # PDF outline → Word rows + word_pdf_pages/ files
pnpm run scan-pdf-pages       # word_pdf_pages/ → Word rows (textLabel, qrUrl)
pnpm run import-regions       # GeoJSON → Site rows (lat, lng, geometry, canton)
pnpm run resolve-audio-urls   # qrUrl redirects → Word.audioUrl + WordAudios rows
pnpm run crawl-audio          # audio.dialektatlas.ch → WordAudios + SiteWordAudio rows
```

Or via tsx directly (DATABASE_URL provided by direnv):

```bash
tsx src/util.ts word-csv-map
tsx src/util.ts transform-csvs
```

## Key File Paths

| Path | Purpose |
|---|---|
| `src/util.ts` | CLI entry point (Commander.js) |
| `src/paths.ts` | Canonical path constants |
| `src/commands/` | CLI command implementations |
| `src/lib/` | Utility helpers (array, dict, typecheck, shell) |
| `src/lib/db.ts` | Prisma client singleton |
| `src/umap-file-schema/` | Zod schemas for `.umap` file format |
| `src/umap-file-schema/umap_type_analysis/examples/umap_backup_dialaktatlas-zwiebel.umap` | Canonical uMap example |
| `src/source_data/word_mapping_csvs/` | Raw CSV input files |
| `src/source_data/word_pdf_pages/` | Extracted per-word PDF pages |
| `prisma/schema.prisma` | Database schema (3 models: Word, Site, SurveyRecord + audio models) |
| `prisma/migrations/` | Migration SQL history |
| `prisma/db_backups/` | Timestamped gzip DB dumps (run `pnpm run db:backup` before migrations) |
| `.envrc` | direnv config — loads DATABASE_URL from `.env.local`, adds `node_modules/.bin` to PATH |
| `.env.local` | Local secrets (DATABASE_URL) — not committed |

## CSV File Naming Convention

`{word}_{age_group}_QGIS.csv`

Age groups: `1_sds` (standard sample), `2_alt` (older speakers), `3_jung` (younger speakers)

## word_data JSON Structure

```jsonc
{
  "word": "Zwiebel",
  "jung": [
    {
      "site_code": "AG01",
      "secondary_site_code": "AG34",
      "town_name": "Aarau",
      "dom_var": "zwibbel",
      "variants": ["zwibbel"],
      "hexcode1": "#b2d06c",
      "hexcodes": ["#b2d06c"],
      "nvar": "a"
    }
  ],
  "alt": [...],
  "sds": [...]
}
```

## uMap File Format

The `.umap` format is a JSON superset of GeoJSON. Zod schemas in `src/umap-file-schema/` describe
the full structure. Key schema files:

- `umap-file-schema.ts` — root schema
- `UMapPropertiesSchema.ts` — global map properties
- `LayerUmapOptionsSchema.ts` — per-layer options (color, label, display)
- `FeaturePropertiesSchema.ts` — per-feature properties (`_umap_options`, `name`)

Switzerland bounding box: `{ east: 13.546143, west: 4.584045, north: 48.542069, south: 44.746733 }`
Default center: `{ lat: 46.87, lng: 8.56 }`, zoom: 10

## Tech Stack

- **Runtime**: Node.js 25+ (strict), pnpm 11
- **Language**: TypeScript, executed via `tsx` (no compile step needed)
- **Validation**: Zod v4
- **CLI**: Commander.js (`@commander-js/extra-typings`)
- **CSV parsing**: csv-parse
- **Linting**: ESLint + Prettier + CSpell

## TypeScript Conventions

### Derive types from Zod schemas — never duplicate them

Every Zod schema already defines its type. Use `z.infer` instead of writing a parallel type:

```ts
// ✓ correct
export type CsvRow = z.infer<typeof CsvRowSchema>;

// ✗ wrong — duplicates what the schema already expresses
export type CsvRow = { site_code: string; dom_var: string; ... };
```

If you need a subtype or variant, derive it from the existing type:

```ts
type ConsolidatedRecord = Pick<CsvRow, 'site_code' | 'nvar'> & { variants: string[] };
```

### Import and transform library types — never replicate them

Do not copy type shapes out of libraries. Import the type and narrow or extend it:

```ts
// ✓ correct
import type { ZodTypeAny } from 'zod';
type NarrowedInput = z.input<typeof SomeSchema>;

// ✗ wrong — hand-copying what zod / csv-parse / commander already exports
type MyZodThing = { _def: unknown; ... };
```

### Never duplicate types or code

If a type exists anywhere in `src/`, use it. Search before writing a new one. Three identical
inline types is worse than one shared import.

### `type` only — never `interface`

```ts
// ✓ correct
type WordRecord = { site_code: string; dom_var: string };

// ✗ wrong
interface WordRecord { site_code: string; dom_var: string }
```

### Literal unions — never `enum`

```ts
// ✓ correct
type AgeGroup = 'jung' | 'alt' | 'sds';

// ✗ wrong
enum AgeGroup { Jung = 'jung', Alt = 'alt', Sds = 'sds' }
```

`z.enum(['jung', 'alt', 'sds'])` is fine — it produces a literal union via `z.infer`.

### `index.ts` export files — always use `ts-exports`

Never write or edit `index.ts` barrel files by hand. Always generate them with:

```bash
/Users/kaspi/bin/dev-util ts-exports -r <directory_path>
```

Run this command against the directory whose `index.ts` needs to be created or updated.
