import * as z from 'zod';

import { RoutePreferenceEnum } from './RoutePreferenceEnum';

export const RouteSchema = z.object({
  active: z
    .boolean()
    .optional()
    .meta({ description: 'Indicates whether the route is active' }),
  coordinates: z
    .array(z.number())
    .optional()
    .meta({ description: 'Array of coordinates for the route' }),
  elevation: z
    .boolean()
    .optional()
    .meta({ description: 'Indicates whether elevation data is included' }),
  preference: RoutePreferenceEnum.optional().meta({
    description: 'Specifies the preference of the route',
  }),
  profile: RoutePreferenceEnum.optional().meta({
    description: 'Specifies the profile of the route',
  }),
});
export type Route = z.infer<typeof RouteSchema>;
