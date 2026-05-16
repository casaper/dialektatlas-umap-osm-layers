import { createCommand } from '@commander-js/extra-typings';
import { readFile } from 'fs/promises';

import { prisma } from '../lib';
import { regionGeoJsonPath } from '../paths';

type GeoJsonFeature = {
  type: 'Feature';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geometry: any;
  properties: Record<string, unknown>;
};

type GeoJsonCollection = {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
};

export const importRegionsCommand = createCommand('import-regions')
  .description(
    'Import region geometries and coordinates from GeoJSON into Site rows'
  )
  .action(async () => {
    const raw = await readFile(regionGeoJsonPath, 'utf-8');
    const geojson = JSON.parse(raw) as GeoJsonCollection;
    const features = geojson.features;

    console.log(`Importing ${features.length} region features...`);

    let upserted = 0;
    let skipped = 0;

    for (const feature of features) {
      const p = feature.properties;
      const siteCode = p['site_code'];
      if (typeof siteCode !== 'string') {
        skipped++;
        continue;
      }

      const lat = typeof p['LAT'] === 'number' ? p['LAT'] : null;
      const lng = typeof p['LONG'] === 'number' ? p['LONG'] : null;
      const townName =
        typeof p['SDATS_fullname'] === 'string'
          ? p['SDATS_fullname']
          : siteCode;
      const sdsCode = typeof p['SDS_CODE'] === 'string' ? p['SDS_CODE'] : null;

      await prisma.site.upsert({
        where: { siteCode },
        create: {
          siteCode,
          townName,
          lat,
          lng,
          geometry: feature.geometry,
          sdsCode,
          canton: siteCode.slice(0, 2),
        },
        update: { lat, lng, geometry: feature.geometry, sdsCode, canton: siteCode.slice(0, 2) },
      });
      upserted++;
    }

    await prisma.$disconnect();
    console.log(
      `Done — ${upserted} sites updated, ${skipped} features skipped (no site_code).`
    );
  });
