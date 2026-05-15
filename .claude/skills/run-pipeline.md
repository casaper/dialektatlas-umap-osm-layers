---
description: Runs the full CSV → word_data JSON transformation pipeline. Step 1 re-indexes the CSV files, step 2 processes all words. Use this when source CSVs have changed or word_data needs to be regenerated.
---

Run the Dialektatlas data transformation pipeline in two steps.

## Step 1 — Re-index CSV files

```bash
pnpm run word-map
```

This scans `src/source_data/word_mapping_csvs/` and writes the index
`src/source_data/word-age-grouped-csvs.json` (maps each word → its jung/alt/sds CSV filenames).

## Step 2 — Transform all words

```bash
pnpm run transform-csvs
```

This reads the index, processes every word's CSV files, and writes consolidated JSON to
`src/source_data/word_data/{word}.json`.

## After running

Report:
- Number of words processed
- Any warnings printed during consolidation (duplicate removal, variant conflicts)
- Total files now in `src/source_data/word_data/`

If either step fails, show the error and diagnose before retrying.