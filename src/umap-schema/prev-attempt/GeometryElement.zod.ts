import * as z from 'zod';

export const GeometryElementSchema = z.object({
  bbox: z.array(z.number()).optional(),
  coordinates: z.array(
    z.union([
      z.array(
        z.union([
          z.array(z.union([z.array(z.number()), z.number()])),
          z.number(),
        ])
      ),
      z.number(),
    ])
  ),
  type: z.enum([
    'LineString',
    'MultiLineString',
    'MultiPoint',
    'MultiPolygon',
    'Point',
    'Polygon',
  ]),
});
export type GeometryElement = z.infer<typeof GeometryElementSchema>;
