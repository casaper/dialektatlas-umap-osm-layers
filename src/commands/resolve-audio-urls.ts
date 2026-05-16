import { execFile } from 'child_process';
import { promisify } from 'util';

import { createCommand } from '@commander-js/extra-typings';
import clc from 'cli-color';

import { prisma } from '../lib';

const execFileAsync = promisify(execFile);

const resolveRedirect = async (url: string): Promise<string> => {
  // Use curl to follow redirects and return the final URL.
  // Arguments passed as array to avoid any shell-injection risk.
  const { stdout } = await execFileAsync('curl', [
    '-s',
    '-I',
    '-L',
    '-w',
    '%{url_effective}',
    '-o',
    '/dev/null',
    url,
  ]);
  return stdout.trim();
};

export const resolveAudioUrlsCommand = createCommand('resolve-audio-urls')
  .description(
    'Resolve qrUrl HTTP redirects and store audio.dialektatlas.ch URLs on Word rows'
  )
  .action(async () => {
    const words = await prisma.word.findMany({
      where: { qrUrl: { not: null }, audioUrl: null },
      select: { id: true, wordKey: true, qrUrl: true },
    });

    console.log(`Resolving ${words.length} audio URLs...`);

    let resolved = 0;
    let failed = 0;

    for (const word of words) {
      try {
        const audioUrl = await resolveRedirect(word.qrUrl!);

        if (!audioUrl.startsWith('https://audio.dialektatlas.ch/')) {
          throw new Error(`Unexpected redirect target: ${audioUrl}`);
        }

        await prisma.wordAudios.upsert({
          where: { audioUrl },
          create: { audioUrl },
          update: {},
        });

        await prisma.word.update({
          where: { id: word.id },
          data: { audioUrl },
        });

        console.log(`  ${clc.cyan(word.wordKey)}: ${word.qrUrl} → ${audioUrl}`);
        resolved++;
      } catch (err) {
        console.error(
          clc.red(
            `  ${word.wordKey}: failed — ${err instanceof Error ? err.message : err}`
          )
        );
        failed++;
      }
    }

    await prisma.$disconnect();
    console.log(`Done — ${resolved} resolved, ${failed} failed.`);
  });