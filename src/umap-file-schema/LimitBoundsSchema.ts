import * as z from 'zod';

export const LimitBoundsSchema = z.object({
  east: z
    .number()
    .meta({ description: 'Easternmost boundary coordinate' })
    .optional(),
  north: z
    .number()
    .meta({ description: 'Northernmost boundary coordinate' })
    .optional(),
  south: z
    .number()
    .meta({ description: 'Southernmost boundary coordinate' })
    .optional(),
  west: z
    .number()
    .meta({ description: 'Westernmost boundary coordinate' })
    .optional(),
});
export type LimitBounds = z.infer<typeof LimitBoundsSchema>;
