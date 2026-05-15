import { createCommand } from '@commander-js/extra-typings';
import { execFile as cpExecFile } from 'child_process';
import { existsSync } from 'fs';
import { mkdtemp, readdir, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { promisify } from 'util';

import { prisma } from '../lib';
import { wordPdfPagesDir } from '../paths';

const execFile = promisify(cpExecFile);

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

            await prisma.word.updateMany({
              where: { wordKey, qrUrl: null },
              data: { textLabel, qrUrl },
            });

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
    const withQr = await prisma.word.count({ where: { qrUrl: { not: null } } });
    await prisma.$disconnect();
    console.log(`PDF scan: ${processed} words`);
    console.log(`  With QR codes: ${withQr}`);
  });
