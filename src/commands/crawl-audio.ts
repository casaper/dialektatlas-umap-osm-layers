import { AgeGroup } from '@prisma/client';
import { createCommand } from '@commander-js/extra-typings';
import clc from 'cli-color';
import { chromium, type Page } from 'playwright';

import { prisma } from '../lib';

const AUDIO_BASE = 'https://audio.dialektatlas.ch';

const VALID_AGE_GROUPS = new Set<string>(Object.values(AgeGroup));
const toAgeGroup = (s: string): AgeGroup | null => {
  const v = s.toLowerCase().trim();
  return VALID_AGE_GROUPS.has(v) ? (v as AgeGroup) : null;
};

const normalizeSlug = (slug: string): string =>
  slug
    .replace(/^\d+_/, '')
    .toLowerCase()
    .replace(/[^a-zäöüáéíóú0-9]/g, '');

const parseSiteLabel = (
  label: string
): { townName: string; canton: string; ageGroup: AgeGroup | null } | null => {
  const [locationPart, ageGroupStr] = label.split(' | ');
  if (!locationPart || !ageGroupStr) return null;
  const tokens = locationPart.trim().split(' ');
  const canton = tokens.pop()!;
  const townName = tokens.join(' ');
  return { townName, canton, ageGroup: toAgeGroup(ageGroupStr) };
};

const locatorTexts = async (
  page: Page,
  selector: string
): Promise<string[]> => {
  const locator = page.locator(selector);
  const count = await locator.count().catch(() => 0);
  const texts: string[] = [];
  for (let i = 0; i < count; i++) {
    const text =
      (await locator
        .nth(i)
        .textContent()
        .catch(() => '')) ?? '';
    texts.push(text.trim());
  }
  return texts;
};

const scrapeVariablePage = async (page: Page, audioUrl: string) => {
  await page.goto(audioUrl, { waitUntil: 'networkidle', timeout: 30_000 });

  const title = await page
    .locator(
      '#root main div.relative.text-center > div > div > div.flex-grow.text-center.text-xl'
    )
    .textContent({ timeout: 5_000 })
    .then(t => t?.trim() ?? null)
    .catch(() => null);

  const pageLabel = await page
    .locator('#root main div.pt-16 > div.text-gray-500 > div > div')
    .textContent({ timeout: 5_000 })
    .then(t => t?.trim() ?? null)
    .catch(() => null);
  const pageNumber = pageLabel
    ? parseInt(pageLabel.replace(/\D/g, ''), 10) || null
    : null;

  const slug = new URL(audioUrl).pathname.split('/').pop()!;
  const derivedWordKey = normalizeSlug(slug);

  await prisma.wordAudios.upsert({
    where: { audioUrl },
    create: { audioUrl, title, pageNumber },
    update: { title, pageNumber },
  });

  const matchedWord = await prisma.word.findFirst({
    where: { wordKey: derivedWordKey },
    select: { wordKey: true, audioUrl: true },
  });
  if (matchedWord && !matchedWord.audioUrl) {
    await prisma.word.update({
      where: { wordKey: matchedWord.wordKey },
      data: { audioUrl },
    });
  }
  const wordKey = matchedWord?.wordKey ?? null;

  const chWordSel =
    '#root main > div > div.text-charcoal > div > div.pt-16 > div > div > div > span.font-bold.text-xl';
  const siteLabelSel =
    '#root main > div > div.text-charcoal > div > div.pt-16 > div > div > div > p.text-sm.text-gray-600';

  const chWords = await locatorTexts(page, chWordSel);
  const siteLabels = await locatorTexts(page, siteLabelSel);

  // Capture FLAC URLs passively via request listener, then trigger each play button.
  // Play buttons are SVG icons with no text — we can't filter by hasText.
  // Instead: register listener first, click every button sequentially, match by arrival order.
  const capturedFlac: string[] = [];
  page.on('request', req => {
    if (req.url().includes('/file/') && req.url().endsWith('.flac')) {
      capturedFlac.push(req.url());
    }
  });

  const allButtons = page.locator('button');
  const buttonCount = await allButtons.count().catch(() => 0);
  for (let i = 0; i < buttonCount; i++) {
    await allButtons
      .nth(i)
      .click()
      .catch(() => null);
    await page.waitForTimeout(400);
  }

  let siteCount = 0;
  for (let i = 0; i < chWords.length; i++) {
    const chWord = chWords[i];
    const label = siteLabels[i];
    if (!label) continue;

    const parsed = parseSiteLabel(label);
    if (!parsed) continue;
    const { townName, canton, ageGroup } = parsed;

    if (!ageGroup) {
      console.warn(`  Unknown ageGroup in label: "${label}" — skipping`);
      continue;
    }

    const site = await prisma.site.findUnique({
      where: { townName_canton: { townName, canton } },
      select: { siteCode: true },
    });
    const siteCode = site?.siteCode ?? null;

    await prisma.siteWordAudio.upsert({
      where: {
        audioUrl_townName_canton_ageGroup: {
          audioUrl,
          townName,
          canton,
          ageGroup,
        },
      },
      create: {
        audioUrl,
        wordKey,
        chWord,
        townName,
        canton,
        ageGroup,
        siteCode,
        audioFileUrl: capturedFlac[i] ?? null,
      },
      update: {
        chWord,
        wordKey,
        siteCode,
        audioFileUrl: capturedFlac[i] ?? undefined,
      },
    });
    siteCount++;
  }

  return { title, pageNumber, wordKey, siteCount };
};

const discoverVariableUrls = async (page: Page): Promise<string[]> => {
  await page.goto(AUDIO_BASE, { waitUntil: 'networkidle', timeout: 30_000 });
  const links = page.locator('a[href*="/variable/"]');
  const count = await links.count().catch(() => 0);
  const urls: string[] = [];
  for (let i = 0; i < count; i++) {
    const href =
      (await links
        .nth(i)
        .getAttribute('href')
        .catch(() => null)) ?? '';
    if (!href) continue;
    urls.push(href.startsWith('http') ? href : `${AUDIO_BASE}${href}`);
  }
  return urls;
};

export const crawlAudioCommand = createCommand('crawl-audio')
  .description(
    'Crawl audio.dialektatlas.ch to scrape word audio data into WordAudios and SiteWordAudio rows'
  )
  .option(
    '--discover',
    'Also crawl the site root to discover new variable pages',
    false
  )
  .action(async ({ discover }) => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Build skip list of all known audioUrls already in the DB
    const existingSet = new Set(
      (await prisma.wordAudios.findMany({ select: { audioUrl: true } })).map(
        r => r.audioUrl
      )
    );

    // Default crawl queue: WordAudios rows that have no title yet (not yet scraped)
    const queue = new Set(
      (
        await prisma.wordAudios.findMany({
          where: { title: null },
          select: { audioUrl: true },
        })
      ).map(r => r.audioUrl)
    );

    if (discover) {
      console.log('Discovering variable pages from site root...');
      const discovered = await discoverVariableUrls(page);
      let newCount = 0;
      for (const url of discovered) {
        if (!existingSet.has(url)) {
          await prisma.wordAudios
            .create({ data: { audioUrl: url } })
            .catch(() => null);
          queue.add(url);
          newCount++;
        }
      }
      console.log(
        `Found ${discovered.length} links on root page (${newCount} new).`
      );
    }

    const allUrls = [...queue];
    console.log(`Crawling ${allUrls.length} audio pages...`);

    let ok = 0;
    let errCount = 0;

    for (const audioUrl of allUrls) {
      try {
        const result = await scrapeVariablePage(page, audioUrl);
        console.log(
          [
            clc.cyan(result.title ?? audioUrl),
            `p.${result.pageNumber ?? '?'}`,
            `${result.siteCount} sites`,
            result.wordKey
              ? clc.green(`→ ${result.wordKey}`)
              : clc.yellow('no word match'),
          ].join('  ')
        );
        ok++;
      } catch (e) {
        console.error(clc.red(`  ${audioUrl}: ${e}`));
        errCount++;
      }
    }

    await browser.close();
    await prisma.$disconnect();
    console.log(`Done — ${ok} pages scraped, ${errCount} errors.`);
  });
