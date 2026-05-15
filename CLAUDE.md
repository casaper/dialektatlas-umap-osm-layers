# Dialektatlas uMap OSM Layers

## Project Purpose

Convert Swiss-German dialect research data from [Dialektatlas](https://dialektatlas.ch/) into
interactive map overlays on [uMap](https://umap.osm.ch/) (OpenStreetMap). The source data comes from
a QGIS project built by the Dialektatlas researchers. Each word has geographic survey data showing
which dialect variant was used in which Swiss region, across three age groups.

POC: [Zwiebel map](https://umap.osm.ch/en/map/dialaktatlas-zwiebel_11727#10/46.870519/8.560410)

## Critical Constraints

**NEVER explore `10_Kartierungssoftware/`** without explicit user permission. It is a separate 3GB
QGIS git repository. Reading it will exhaust context. Always ask first.

**Never read `src/source_data/samples.json`** — it is 47 MB.

## Data Pipeline

```
src/source_data/word_mapping_csvs/   ← QGIS CSV exports (input, ~1100 files)
         │
         ▼  pnpm run word-map
src/source_data/word-age-grouped-csvs.json   ← index: word → {jung, alt, sds} CSVs
         │
         ▼  pnpm run transform-csvs
src/source_data/word_data/{word}.json        ← consolidated records per word
         │
         ▼  (NEXT MILESTONE — not yet built)
output/{word}.umap                           ← uMap layer file for upload
```

**Next milestone**: Build the `word_data/*.json → .umap` generator.
The word_data records do NOT yet include lat/lng coordinates — site_codes need to be linked
to a coordinate lookup. This is a known gap to resolve when building the generator.

## Running Commands

```bash
pnpm run word-map        # re-index CSV files → word-age-grouped-csvs.json
pnpm run transform-csvs  # process all words → src/source_data/word_data/*.json
```

Or via tsx directly:

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
| `src/umap-file-schema/` | Zod schemas for `.umap` file format |
| `src/umap-file-schema/umap_type_analysis/examples/umap_backup_dialaktatlas-zwiebel.umap` | Canonical uMap example |
| `src/source_data/word_mapping_csvs/` | Raw CSV input files |
| `src/source_data/word_data/` | Processed word JSON output |
| `src/source_data/word-age-grouped-csvs.json` | CSV index manifest |

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

## Custom Agents & Skills

- `/word-data-inspector <word>` — summarize a word's dialect data (variants, coverage, hexcodes)
- `/validate-umap [file]` — validate a `.umap` file against the Zod schemas
- `/run-pipeline` — run the full CSV → word_data transformation
- `word-data-inspector` agent — available via Agent tool for deeper word analysis
- `umap-generator` agent — drafts a `.umap` file from a word's processed JSON