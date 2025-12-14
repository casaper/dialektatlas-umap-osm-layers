import * as z from 'zod';

import { GeometryElementSchema } from './GeometryElement.zod';
import { RouteSchema } from './Route.zod';

export const CustomUserFieldsSchema = z.object({
  key: z.string(),
  type: z.enum([
    'Boolean',
    'Date',
    'Datetime',
    'Enum',
    'Number',
    'String',
    'Text',
  ]),
});
export type CustomUserFields = z.infer<typeof CustomUserFieldsSchema>;

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

export const LicenceSchema = z.object({
  name: z.string(),
  url: z.string(),
});
export type Licence = z.infer<typeof LicenceSchema>;

export const PropertiesLimitBoundsSchema = z.object({
  east: z.number(),
  north: z.number(),
  south: z.number(),
  west: z.number(),
});
export type PropertiesLimitBounds = z.infer<typeof PropertiesLimitBoundsSchema>;

export const GeoJsonSchema = z.object({
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
  type: z.enum([
    'GeometryCollection',
    'LineString',
    'MultiLineString',
    'MultiPoint',
    'MultiPolygon',
    'Point',
    'Polygon',
  ]),
  geometries: z.array(GeometryElementSchema).optional(),
});
export type GeoJson = z.infer<typeof GeoJsonSchema>;

export const PropertiesUmapOptionsSchema = z.object({
  color: z.string().optional(),
  dashArray: z.string().optional(),
  fill: z.boolean().optional(),
  fillColor: z.string().optional(),
  fillOpacity: z.any().optional(),
  iconClass: z
    .enum(['Ball', 'Circle', 'Default', 'Drop', 'LargeCircle', 'Raw'])
    .optional(),
  iconOpacity: z.number().optional(),
  iconSize: z.number().optional(),
  iconUrl: z.string().optional(),
  interactive: z.boolean().optional(),
  labelDirection: z.enum(['auto', 'bottom', 'left', 'right', 'top']).optional(),
  labelInteractive: z.boolean().optional(),
  labelKey: z.string().optional(),
  mask: z.boolean().optional(),
  opacity: z.number().optional(),
  outlink: z.string().optional(),
  outlinkTarget: z.enum(['blank', 'parent', 'self']).optional(),
  popupShape: z.enum(['Default', 'Large', 'Panel']).optional().meta({
    description:
      'Define the shape of the popup.  \nDefault: Popup  \nLarge: Popup (large)  \nPanel: Side panel',
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
  showLabel: z.boolean().optional(),
  smoothFactor: z.number().optional(),
  stroke: z.boolean().optional(),
  textPath: z.string().optional(),
  textPathColor: z.string().optional(),
  textPathOffset: z.number().optional(),
  textPathPosition: z.enum(['center', 'end', 'start']).optional(),
  textPathRepeat: z.boolean().optional(),
  textPathRotate: z.number().optional(),
  textPathSize: z.number().optional(),
  weight: z.number().optional(),
  zoomTo: z.number().optional(),
});
export type PropertiesUmapOptions = z.infer<typeof PropertiesUmapOptionsSchema>;

export const LayerUmapOptionsSchema = z.object({
  browsable: z.boolean(),
  description: z.string().optional(),
  displayOnLoad: z.boolean(),
  editMode: z.enum(['advanced', 'disabled', 'simple']),
  fields: z.array(CustomUserFieldsSchema),
  inCaption: z.boolean(),
  labelKey: z.string().optional(),
  limitBounds: z
    .object({
      east: z.string().optional(),
      north: z.string().optional(),
      south: z.string().optional(),
      west: z.string().optional(),
    })
    .optional(),
  name: z.string(),
  rank: z.number(),
  remoteData: RemoteDataSchema,
  showLabel: z.boolean().optional(),
});
export type LayerUmapOptions = z.infer<typeof LayerUmapOptionsSchema>;

export const UMapPropertiesSchema = z.object({
  captionBar: z.boolean(),
  captionControl: z.boolean(),
  center: z.object({
    lat: z.number(),
    lng: z.number(),
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
  licence: LicenceSchema,
  limitBounds: PropertiesLimitBoundsSchema,
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
export type UMap2Properties = z.infer<typeof UMapPropertiesSchema>;

export const FeaturePropertiesSchema = z.object({
  _umap_options: PropertiesUmapOptionsSchema.optional(),
  fid: z.number().optional(),
  name: z.string().optional(),
});
export type FeatureProperties = z.infer<typeof FeaturePropertiesSchema>;

export const GeoJsonFeatureSchema = z.object({
  bbox: z.array(z.number()).optional(),
  geometry: z.union([GeoJsonSchema, z.null()]),
  id: z.union([z.number(), z.string()]).optional(),
  properties: FeaturePropertiesSchema,
  type: z.enum(['Feature']),
});
export type GeoJsonFeature = z.infer<typeof GeoJsonFeatureSchema>;

export const UMapLayerGeoJsonFeatureCollectionSchema = z.object({
  _umap_options: LayerUmapOptionsSchema.optional(),
  bbox: z.array(z.number()).optional(),
  features: z.array(GeoJsonFeatureSchema),
  type: z.enum(['FeatureCollection']),
});
export type UMapLayerGeoJsonFeatureCollection = z.infer<
  typeof UMapLayerGeoJsonFeatureCollectionSchema
>;

export const UmapFileZodSchema = z.object({
  geometry: z.object({
    coordinates: z.array(z.number()),
    type: z.string(),
  }),
  layers: z.array(UMapLayerGeoJsonFeatureCollectionSchema),
  properties: UMapPropertiesSchema,
  type: z.string(),
  uri: z.string(),
});
export type UmapFileZod = z.infer<typeof UmapFileZodSchema>;
