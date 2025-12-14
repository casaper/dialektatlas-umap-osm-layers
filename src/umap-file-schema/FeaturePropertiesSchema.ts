import * as z from 'zod';

import { PropertiesUmapOptionsSchema } from './dependencies/PropertiesUmapOptionsSchema';

export const FeaturePropertiesSchema = z.object({
  _umap_options: PropertiesUmapOptionsSchema.optional(),
  fid: z.number().optional(),
  name: z.string().optional(),
});
export type FeatureProperties = z.infer<typeof FeaturePropertiesSchema>;
