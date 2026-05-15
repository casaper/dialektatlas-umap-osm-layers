import * as z from 'zod';

import { PropertiesUmapOptionsSchema } from './PropertiesUmapOptionsSchema';

export const FeaturePropertiesSchema = z.looseObject({
  _umap_options: PropertiesUmapOptionsSchema.optional(),
  description: z.string().optional(),
  fid: z.number().optional(),
  name: z.string().optional(),
});
export type FeatureProperties = z.infer<typeof FeaturePropertiesSchema>;
