import * as z from 'zod';

import { CustomUserFieldsSchema } from './CustomUserFieldsSchema';
import { LimitBoundsSchema } from './LimitBoundsSchema';
import { RemoteDataSchema } from './RemoteDataSchema';

export const LayerUmapOptionsSchema = z.object({
  browsable: z.boolean().optional().meta({
    description:
      'Set it to false to hide this layer from the slideshow, the data browser, the popup navigation…',
  }),
  choropleth: z.record(z.string(), z.any()).optional(),
  circles: z.record(z.string(), z.any()).optional(),
  cluster: z.record(z.string(), z.any()).optional(),
  color: z.string().optional(),
  dashArray: z.string().optional().meta({
    description: `A comma separated list of numbers that defines the stroke dash pattern. Ex.: "5, 10, 15".`,
  }),
  description: z.string().optional(),
  displayOnLoad: z.boolean().optional(),
  editMode: z.enum(['advanced', 'disabled', 'simple']).optional(),
  fields: z.array(CustomUserFieldsSchema).optional(),
  fill: z.boolean().optional(),
  fillColor: z.string().optional(),
  fillOpacity: z.union([z.number(), z.string()]).optional(),
  filterKey: z.string().optional(),
  group: z.boolean().optional(),
  heat: z.record(z.string(), z.any()).optional(),
  iconClass: z
    .enum(['Ball', 'Circle', 'Default', 'Drop', 'LargeCircle', 'Raw'])
    .optional(),
  iconOpacity: z.number().optional(),
  iconSize: z.number().optional(),
  iconUrl: z.string().optional(),
  inCaption: z.boolean().optional(),
  interactive: z.boolean().optional(),
  labelDirection: z.enum(['auto', 'bottom', 'left', 'right', 'top']).optional(),
  labelInteractive: z.boolean().optional(),
  labelKey: z
    .string()
    .optional()
    .meta({
      description: [
        'The name of the property to use as layer label (eg.: "nom").',
        'You can also use properties inside brackets to use more than one or mix with',
        'static content (eg.: "&lcub;name&rcub; in &lcub;place&rcub;")',
      ].join('\n'),
    }),
  limitBounds: LimitBoundsSchema.optional(),
  mask: z.boolean().optional(),
  name: z.string().optional(),
  opacity: z.union([z.number(), z.string()]).optional(),
  outlink: z.string().optional(),
  outlinkTarget: z.enum(['blank', 'parent', 'self']).optional(),
  permissions: z.object({ edit_status: z.number() }).optional(),
  popupContentTemplate: z.string().optional(),
  popupShape: z.enum(['Default', 'Large', 'Panel']).optional(),
  popupTemplate: z
    .enum([
      'Default',
      'GeoRSSImage',
      'GeoRSSLink',
      'OSM',
      'Route',
      'Table',
      'Wikipedia',
    ])
    .optional(),
  rank: z.number().optional(),
  remoteData: RemoteDataSchema.optional(),
  rules: z
    .array(
      z.object({
        condition: z.string().optional(),
        name: z.string().optional(),
        properties: z.record(z.string(), z.any()).optional(),
      })
    )
    .optional(),
  showLabel: z.boolean().nullable().optional().meta({
    description:
      "Whether to display a label on the layer. Choices: 'always' (true), 'never' (false), or 'on hover' (null). Default is 'never'.",
  }),
  smoothFactor: z.union([z.number(), z.string()]).optional(),
  sortKey: z.string().optional(),
  stroke: z.boolean().optional(),
  textPath: z.string().optional(),
  textPathColor: z.string().optional(),
  textPathOffset: z.number().optional(),
  textPathPosition: z.enum(['center', 'end', 'start']).optional(),
  textPathRepeat: z.boolean().optional(),
  textPathRotate: z.number().optional(),
  textPathSize: z.number().optional(),
  weight: z.union([z.number(), z.string()]).optional(),
});
export type LayerUmapOptions = z.infer<typeof LayerUmapOptionsSchema>;
