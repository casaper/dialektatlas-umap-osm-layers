import * as z from 'zod';

import { UMapLayerGeoJsonFeatureCollectionSchema } from './UMapLayerGeoJsonFeatureCollectionSchema';
import { UMapPropertiesSchema } from './UMapPropertiesSchema';

export const UmapFileSchema = z.object({
  geometry: z.object({
    coordinates: z.array(z.number()),
    type: z.string(),
  }),
  layers: z.array(UMapLayerGeoJsonFeatureCollectionSchema),
  properties: UMapPropertiesSchema,
  type: z.string(),
  uri: z.string(),
});
export type UmapFile = z.infer<typeof UmapFileSchema>;
