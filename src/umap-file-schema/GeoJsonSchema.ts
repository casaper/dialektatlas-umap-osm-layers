import * as z from 'zod';

import { GeometryElementSchema } from './GeometryElementSchema';

export const GeoJsonSchema = z.object({
  type: z.enum([
    'GeometryCollection',
    'LineString',
    'MultiLineString',
    'MultiPoint',
    'MultiPolygon',
    'Point',
    'Polygon',
  ]),
  bbox: z.array(z.number()).optional(),
  coordinates: z
    .array(
      z.union([
        z.array(
          z.union([
            z.array(z.union([z.array(z.number()), z.number()])),
            z.number(),
          ])
        ),
        z.number(),
      ])
    )
    .optional(),
  geometries: z.array(GeometryElementSchema).optional(),
});
export type GeoJson = z.infer<typeof GeoJsonSchema>;
