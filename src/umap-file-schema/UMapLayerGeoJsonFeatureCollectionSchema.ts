import * as z from 'zod';

import { GeoJsonFeatureSchema } from './GeoJsonFeatureSchema';
import { LayerUmapOptionsSchema } from './LayerUmapOptionsSchema';

export const UMapLayerGeoJsonFeatureCollectionSchema = z.object({
  _umap_options: LayerUmapOptionsSchema.optional(),
  bbox: z.array(z.number()).optional(),
  features: z.array(GeoJsonFeatureSchema),
  properties: LayerUmapOptionsSchema.optional(),
  type: z.enum(['FeatureCollection']),
});
export type UMapLayerGeoJsonFeatureCollection = z.infer<
  typeof UMapLayerGeoJsonFeatureCollectionSchema
>;
