import * as z from 'zod';

import { LimitBoundsSchema } from './LimitBoundsSchema';

export const UMapPropertiesSchema = z.object({
  captionBar: z.boolean(),
  captionControl: z.boolean(),
  center: z.object({
    lat: z.number().meta({ description: 'Latitude of the center point' }),
    lng: z.number().meta({ description: 'Longitude of the center point' }),
  }),
  datalayersControl: z.boolean(),
  description: z.string(),
  displayPopupFooter: z.boolean(),
  easing: z.boolean(),
  editinosmControl: z.null(),
  embedControl: z.null(),
  fields: z.array(z.any()),
  fullscreenControl: z.null(),
  homeControl: z.boolean(),
  labelInteractive: z.boolean(),
  licence: z.object({
    name: z.string(),
    url: z.string(),
  }),
  limitBounds: LimitBoundsSchema,
  locateControl: z.null(),
  longCredit: z.string(),
  measureControl: z.null(),
  miniMap: z.boolean(),
  moreControl: z.boolean(),
  name: z.string(),
  onLoadPanel: z.string(),
  overlay: z.record(z.string(), z.any()),
  permanentCredit: z.string(),
  printControl: z.null(),
  scaleControl: z.boolean(),
  scrollWheelZoom: z.boolean(),
  shortCredit: z.string(),
  showLabel: z.null(),
  slideshow: z.record(z.string(), z.any()),
  tags: z.array(z.string()),
  tilelayer: z.record(z.string(), z.any()),
  zoom: z.number(),
  zoomControl: z.boolean(),
});
export type UMapProperties = z.infer<typeof UMapPropertiesSchema>;
