import * as z from 'zod';

export const RoutePreferenceEnum = z.enum([
  'cycling-regular',
  'driving-car',
  'foot-hiking',
  'foot-walking',
  'wheelchair',
]);
export type RoutePreference = z.infer<typeof RoutePreferenceEnum>;
