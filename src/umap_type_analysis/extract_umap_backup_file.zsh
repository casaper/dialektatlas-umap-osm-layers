#!/usr/bin/env zsh

quicktype \
  --lang schema \
  --src-lang json \
  --out src/umap_type_analysis/umap_schema/uMap2.json \
  src/umap_type_analysis/examples/umap_backup_dialaktatlas-zwiebel.umap

quicktype \
  --lang typescript-zod \
  --src-lang schema \
  --out src/umap_type_analysis/uMap2.zod.ts \
  src/umap_type_analysis/umap_schema/uMap2.json

quicktype \
  --lang typescript \
  --src-lang schema \
  --prefer-unions \
  --prefer-types \
  --converters top-level \
  --out src/umap_type_analysis/uMap2.ts \
  src/umap_type_analysis/umap_schema/uMap2.json
