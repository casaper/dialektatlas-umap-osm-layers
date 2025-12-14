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

export const RoutePreferenceEnum = z.enum([
  'cycling-regular',
  'driving-car',
  'foot-hiking',
  'foot-walking',
  'wheelchair',
]);
export type RoutePreference = z.infer<typeof RoutePreferenceEnum>;

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

export const PropertiesUmapOptionsSchema = z.object({
  color: z.string().optional().meta({ description: 'Color value' }),
  dashArray: z.string().optional().meta({
    description: `A comma separated list of numbers that defines the stroke dash pattern. Ex.: "5, 10, 15".`,
  }),
  fill: z
    .boolean()
    .optional()
    .meta({ description: 'Whether to fill polygons with color.' }),
  fillColor: z
    .string()
    .optional()
    .meta({ description: 'Same as color if not set. [Optional]' }),
  fillOpacity: z.any().optional(),
  iconClass: z
    .enum(['Ball', 'Circle', 'Default', 'Drop', 'LargeCircle', 'Raw'])
    .optional()
    .meta({ description: 'Icon shape' }),
  iconOpacity: z.number().optional(),
  iconSize: z.number().optional().meta({
    description: 'Icon size. Will only affect raw and large circle icons.',
  }),
  iconUrl: z.string().optional().meta({ description: 'Icon symbol' }),
  interactive: z.boolean().optional().meta({
    description:
      'If false, the polygon or line will act as a part of the underlying map.',
  }),
  labelDirection: z
    .enum(['auto', 'bottom', 'left', 'right', 'top'])
    .optional()
    .meta({
      description: 'The direction in which the label is displayed.',
    }),
  labelInteractive: z
    .boolean()
    .optional()
    .meta({ description: 'Whether the label should be interactive.' }),
  labelKey: z
    .string()
    .optional()
    .meta({
      description: [
        'The name of the property to use as layer label (eg.: "nom"). You can also use properties',
        'inside brackets to use more than one or mix with static content (eg.: "&lcub;name&rcub; in &lcub;place&rcub;")',
      ].join('\n'),
    }),
  mask: z
    .boolean()
    .optional()
    .meta({ description: 'Display the polygon inverted' }),
  opacity: z.number().optional().meta({ description: 'Opacity value' }),
  outlink: z.string().optional().meta({
    description: 'Define link to open in a new window on polygon click.',
  }),
  outlinkTarget: z.enum(['blank', 'parent', 'self']).optional(),
  popupShape: z
    .enum(['Default', 'Large', 'Panel'])
    .optional()
    .meta({
      description: [
        'Define the shape of the popup.',
        '',
        'Default: Popup',
        'Large: Popup (large)',
        'Panel: Side panel',
      ].join('\n'),
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
  showLabel: z
    .boolean()
    .optional()
    .meta({
      description: [
        `Whether to display a label on the layer.`,
        `Choices: 'always' (true), 'never' (false), or 'on hover' (null).`,
        `Default is 'never'.`,
      ].join('\n'),
    }),
  smoothFactor: z.number().optional().meta({ description: '' }),
  stroke: z.boolean().optional().meta({ description: '' }),
  textPath: z.string().optional().meta({ description: '' }),
  textPathColor: z.string().optional().meta({ description: '' }),
  textPathOffset: z.number().optional().meta({ description: 'Text offset' }),
  textPathPosition: z.enum(['center', 'end', 'start']).optional().meta({
    description: 'Text position',
  }),
  textPathRepeat: z.boolean().optional().meta({ description: 'Text repeat' }),
  textPathRotate: z.number().optional().meta({ description: 'Text rotate' }),
  textPathSize: z.number().optional().meta({ description: 'Text size' }),
  weight: z.number().optional().meta({ description: 'Weight value' }),
  zoomTo: z
    .number()
    .optional()
    .meta({ description: 'Zoom level for automatic zooms' }),
});
export type PropertiesUmapOptions = z.infer<typeof PropertiesUmapOptionsSchema>;

export const RemoteDataSchema = z.object({
  dynamic: z.boolean().optional().meta({ description: '' }),
  format: z
    .union([
      z.enum(['csv', 'geojson', 'georss', 'gpx', 'kml', 'osm']),
      z.null(),
    ])
    .optional(),
  from: z.number().optional(),
  licence: z.string().optional().meta({ description: '' }),
  proxy: z.boolean().optional().meta({ description: '' }),
  to: z.number().optional(),
  ttl: z.union([z.number(), z.number(), z.null()]).optional(),
  url: z.string().optional(),
});
export type RemoteData = z.infer<typeof RemoteDataSchema>;

export const LayerUmapOptionsSchema = z.object({
  browsable: z.boolean().meta({
    description:
      'Set it to false to hide this layer from the slideshow, the data browser, the popup navigation …',
  }),
  displayOnLoad: z.boolean(),
  editMode: z.enum(['advanced', 'disabled', 'simple']),
  fields: z.array(
    z.object({
      key: z.string().meta({ description: '' }),
      type: z.enum(['String', 'Text']),
    })
  ),
  inCaption: z.boolean(),
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
  showLabel: z.null().optional(),
});
export type LayerUmapOptions = z.infer<typeof LayerUmapOptionsSchema>;

export const UMapPropertiesSchema = z.object({
  center: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  description: z.string(),
  fields: z.array(z.any()),
  fullscreenControl: z.boolean(),
  licence: z.object({
    name: z.string(),
    url: z.string(),
  }),
  limitBounds: z.object({}),
  name: z.string(),
  onLoadPanel: z.string(),
  overlay: z.object({}),
  showLabel: z.null(),
  slideshow: z.object({}),
  tags: z.array(z.string()),
  tilelayer: z.object({}),
  zoom: z.number(),
  zoomControl: z.boolean(),
});
export type UMapProperties = z.infer<typeof UMapPropertiesSchema>;

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

export const UMapGeometrySchema = z.object({
  coordinates: z.array(z.number()),
  type: z.string(),
});
export type UMapGeometry = z.infer<typeof UMapGeometrySchema>;

export const UMapSchema = z.object({
  geometry: UMapGeometrySchema,
  layers: z.array(UMapLayerGeoJsonFeatureCollectionSchema),
  properties: UMapPropertiesSchema,
  type: z.string(),
  uri: z.string(),
});
export type UMap = z.infer<typeof UMapSchema>;
