import { createCommand } from '@commander-js/extra-typings';
import { execFile as cpExecFile } from 'child_process';
import { existsSync } from 'fs';
import { mkdtemp, readdir, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { promisify } from 'util';

import { wordPdfPagesDir, wordPdfScanPath } from '../paths';

const execFile = promisify(cpExecFile);

export type PdfScanEntry = {
  textLabel: string;
  qrUrl: string | null;
};

export type WordPdfScan = Record<string, PdfScanEntry>;

const extractLabel = (rawText: string): string => {
  const lines = rawText
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);
  return lines[1] ?? lines[0] ?? '';
};

const chunkArray = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size)
    chunks.push(arr.slice(i, i + size));
  return chunks;
};

export const scanPdfPagesCommand = createCommand('scan-pdf-pages')
  .description('Extract text labels and QR codes from word SDS PDF pages')
  .action(async () => {
    const dirEntries = await readdir(wordPdfPagesDir, { withFileTypes: true });
    const wordDirs = dirEntries
      .filter(e => e.isDirectory())
      .map(e => e.name)
      .filter(name => existsSync(join(wordPdfPagesDir, name, 'sds.pdf')))
      .sort();

    console.log(`Scanning ${wordDirs.length} SDS PDF pages...`);
    const tmpDir = await mkdtemp(join(tmpdir(), 'dialektatlas-scan-'));
    const scan: WordPdfScan = {};
    let processed = 0;

    try {
      for (const batch of chunkArray(wordDirs, 5)) {
        await Promise.all(
          batch.map(async wordKey => {
            const sdsPath = join(wordPdfPagesDir, wordKey, 'sds.pdf');
            const pngPrefix = join(tmpDir, wordKey);
            const pngPath = `${pngPrefix}-1.png`;

            let textLabel = '';
            let qrUrl: string | null = null;

            try {
              const { stdout } = await execFile('pdftotext', [
                '-raw',
                sdsPath,
                '-',
              ]);
              textLabel = extractLabel(stdout);
            } catch {
              // pdftotext not available or failed — leave textLabel empty
            }

            try {
              await execFile('pdftoppm', [
                '-png',
                '-r',
                '100',
                '-f',
                '1',
                '-l',
                '1',
                sdsPath,
                pngPrefix,
              ]);
              const { stdout } = await execFile('zbarimg', [
                '--quiet',
                '--raw',
                pngPath,
              ]);
              qrUrl = stdout.trim() || null;
            } catch {
              // no QR found or rendering failed
            } finally {
              await rm(pngPath, { force: true });
            }

            scan[wordKey] = { textLabel, qrUrl };
            processed++;
          })
        );
        process.stdout.write(
          `\r  Scanned ${processed} / ${wordDirs.length} words...`
        );
      }
    } finally {
      await rm(tmpDir, { recursive: true, force: true });
    }

    console.log('');
    const sortedScan: WordPdfScan = {};
    for (const key of Object.keys(scan).sort()) sortedScan[key] = scan[key];

    await writeFile(
      wordPdfScanPath,
      JSON.stringify(sortedScan, null, 2),
      'utf-8'
    );
    const withQr = Object.values(scan).filter(e => e.qrUrl !== null).length;
    console.log(`PDF scan: ${Object.keys(scan).length} words`);
    console.log(`  With QR codes: ${withQr}`);
    console.log(`  Written → ${wordPdfScanPath}`);
  });
