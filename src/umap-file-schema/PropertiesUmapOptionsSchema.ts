import * as z from 'zod';

import { RouteSchema } from './RouteSchema';

export const PropertiesUmapOptionsSchema = z.object({
  color: z.string().optional(),
  dashArray: z.string().optional().meta({
    description: `A comma separated list of numbers that defines the stroke dash pattern. Ex.: "5, 10, 15".`,
  }),
  fill: z
    .boolean()
    .optional()
    .meta({ description: 'Whether to fill polygons with color.' }),
  fillColor: z
    .string()
    .optional()
    .meta({ description: 'Same as color if not set. [Optional]' }),
  fillOpacity: z.any().optional(),
  iconClass: z
    .enum(['Ball', 'Circle', 'Default', 'Drop', 'LargeCircle', 'Raw'])
    .optional()
    .meta({ description: 'Icon shape' }),
  iconOpacity: z.number().optional(),
  iconSize: z.number().optional().meta({
    description: 'Icon size. Will only affect raw and large circle icons.',
  }),
  iconUrl: z.string().optional(),
  interactive: z.boolean().optional().meta({
    description:
      'If false, the polygon or line will act as a part of the underlying map.',
  }),
  labelDirection: z
    .enum(['auto', 'bottom', 'left', 'right', 'top'])
    .optional()
    .meta({
      description: 'The direction in which the label is displayed.',
    }),
  labelInteractive: z
    .boolean()
    .optional()
    .meta({ description: 'Whether the label should be interactive.' }),
  labelKey: z
    .string()
    .optional()
    .meta({
      description: [
        'The name of the property to use as layer label (eg.: "nom"). You can also use properties',
        'inside brackets to use more than one or mix with static content (eg.: "&lcub;name&rcub; in &lcub;place&rcub;")',
      ].join('\n'),
    }),
  mask: z.boolean().optional(),
  opacity: z.number().optional(),
  outlink: z.string().optional().meta({
    description: 'Define link to open in a new window on polygon click.',
  }),
  outlinkTarget: z.enum(['blank', 'parent', 'self']).optional(),
  popupShape: z
    .enum(['Default', 'Large', 'Panel'])
    .optional()
    .meta({
      description: [
        'Define the shape of the popup.',
        '',
        'Default: Popup',
        'Large: Popup (large)',
        'Panel: Side panel',
      ].join('\n'),
    }),
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
    .optional()
    .meta({
      description: 'Define the style of the popup content.',
    }),
  route: RouteSchema.optional(),
  showLabel: z
    .boolean()
    .optional()
    .meta({
      description: [
        `Whether to display a label on the layer.`,
        `Choices: 'always' (true), 'never' (false), or 'on hover' (null).`,
        `Default is 'never'.`,
      ].join('\n'),
    }),
  smoothFactor: z.number().optional().meta({
    description:
      'How much to simplify the polyline on each zoom level (more = better performance and smoother look, less = more accurate)',
  }),
  stroke: z
    .boolean()
    .optional()
    .meta({ description: 'Whether to display or not polygons paths.' }),
  textPath: z.string().optional().meta({ description: 'Add text along path' }),
  textPathColor: z.string().optional(),
  textPathOffset: z.number().optional(),
  textPathPosition: z.enum(['center', 'end', 'start']).optional(),
  textPathRepeat: z.boolean().optional(),
  textPathRotate: z.number().optional(),
  textPathSize: z.number().optional(),
  weight: z.number().optional(),
  zoomTo: z
    .number()
    .optional()
    .meta({ description: 'Zoom level for automatic zooms' }),
});
export type PropertiesUmapOptions = z.infer<typeof PropertiesUmapOptionsSchema>;
