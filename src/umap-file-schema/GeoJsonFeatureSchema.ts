import * as z from 'zod';

import { FeaturePropertiesSchema } from './FeaturePropertiesSchema';
import { GeoJsonSchema } from './GeoJsonSchema';

export const GeoJsonFeatureSchema = z.object({
  bbox: z.array(z.number()).optional(),
  geometry: z.union([GeoJsonSchema, z.null()]),
  id: z.union([z.number(), z.string()]).optional(),
  properties: FeaturePropertiesSchema,
  type: z.enum(['Feature']),
});
export type GeoJsonFeature = z.infer<typeof GeoJsonFeatureSchema>;
