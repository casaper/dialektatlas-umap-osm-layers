import * as z from 'zod';

export const RemoteDataSchema = z.object({
  dynamic: z.boolean().optional(),
  format: z
    .union([
      z.enum(['csv', 'geojson', 'georss', 'gpx', 'kml', 'osm']),
      z.null(),
    ])
    .optional(),
  from: z.number().optional(),
  licence: z.string().optional(),
  proxy: z.boolean().optional(),
  to: z.number().optional(),
  ttl: z.union([z.number(), z.number(), z.null()]).optional(),
  url: z.string().optional(),
});
export type RemoteData = z.infer<typeof RemoteDataSchema>;
