import * as z from 'zod';

import { LimitBoundsSchema } from './LimitBoundsSchema';

export const UMapPropertiesSchema = z.object({
  captionBar: z.boolean().optional(),
  captionControl: z.boolean().nullable().optional(),
  captionMenus: z.boolean().optional(),
  center: z
    .object({
      lat: z.number().meta({ description: 'Latitude of the center point' }),
      lng: z.number().meta({ description: 'Longitude of the center point' }),
    })
    .optional(),
  datalayersControl: z.boolean().nullable().optional(),
  defaultView: z.enum(['center', 'data', 'latest', 'locate']).optional(),
  description: z.string().optional(),
  displayPopupFooter: z.boolean().optional(),
  easing: z.boolean().optional(),
  editinosmControl: z.boolean().nullable().optional(),
  embedControl: z.boolean().nullable().optional(),
  fields: z.array(z.any()).optional(),
  filterKey: z.string().optional(),
  fullscreenControl: z.boolean().nullable().optional(),
  homeControl: z.boolean().optional(),
  labelInteractive: z.boolean().optional(),
  layerSwitcher: z.boolean().optional(),
  licence: z
    .union([z.string(), z.object({ name: z.string(), url: z.string() })])
    .optional(),
  limitBounds: LimitBoundsSchema.optional(),
  locateControl: z.boolean().nullable().optional(),
  longCredit: z.string().optional(),
  measureControl: z.boolean().nullable().optional(),
  miniMap: z.boolean().optional(),
  moreControl: z.boolean().optional(),
  name: z.string(),
  onLoadPanel: z
    .enum(['caption', 'databrowser', 'datafilters', 'datalayers', 'none'])
    .optional(),
  overlay: z.record(z.string(), z.any()).nullable().optional(),
  permanentCredit: z.string().optional(),
  permanentCreditBackground: z.boolean().optional(),
  popupContentTemplate: z.string().optional(),
  printControl: z.boolean().nullable().optional(),
  scaleControl: z.boolean().optional(),
  scrollWheelZoom: z.boolean().optional(),
  searchControl: z.boolean().nullable().optional(),
  shortCredit: z.string().optional(),
  showLabel: z.boolean().nullable().optional(),
  slideshow: z.record(z.string(), z.any()).optional(),
  slugKey: z.string().optional(),
  sortKey: z.string().optional(),
  syncEnabled: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  tilelayer: z.record(z.string(), z.any()).optional(),
  tilelayersControl: z.boolean().nullable().optional(),
  umap_id: z.number().optional(),
  zoom: z.number().optional(),
  zoomControl: z.boolean().nullable().optional(),
});
export type UMapProperties = z.infer<typeof UMapPropertiesSchema>;
