import * as z from 'zod';

export const LimitBoundsSchema = z.object({
  east: z.number().meta({ description: 'Easternmost boundary coordinate' }),
  north: z.number().meta({ description: 'Northernmost boundary coordinate' }),
  south: z.number().meta({ description: 'Southernmost boundary coordinate' }),
  west: z.number().meta({ description: 'Westernmost boundary coordinate' }),
});
export type LimitBounds = z.infer<typeof LimitBoundsSchema>;
