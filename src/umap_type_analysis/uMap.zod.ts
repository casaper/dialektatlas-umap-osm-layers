import * as z from 'zod';

export const GeometryTypeSchema = z.enum([
  'LineString',
  'MultiLineString',
  'MultiPoint',
  'MultiPolygon',
  'Point',
  'Polygon',
]);
export type GeometryType = z.infer<typeof GeometryTypeSchema>;

export const GeoJsonPointTypeSchema = z.enum([
  'GeometryCollection',
  'LineString',
  'MultiLineString',
  'MultiPoint',
  'MultiPolygon',
  'Point',
  'Polygon',
]);
export type GeoJsonPointType = z.infer<typeof GeoJsonPointTypeSchema>;

// Icon shape

export const IconShapeSchema = z.enum(['Ball', 'Circle', 'Default', 'Drop', 'LargeCircle', 'Raw']);
export type IconShape = z.infer<typeof IconShapeSchema>;

// The direction in which the label is displayed.

export const LabelDirectionSchema = z.enum(['auto', 'bottom', 'left', 'right', 'top']);
export type LabelDirection = z.infer<typeof LabelDirectionSchema>;

export const OpenLinkInSchema = z.enum(['blank', 'parent', 'self']);
export type OpenLinkIn = z.infer<typeof OpenLinkInSchema>;

// Define the shape of the popup.  \nDefault: Popup  \nLarge: Popup (large)  \nPanel: Side
// panel

export const PopupShapeSchema = z.enum(['Default', 'Large', 'Panel']);
export type PopupShape = z.infer<typeof PopupShapeSchema>;

// Define the style of the popup content.

export const PopupContentStyleSchema = z.enum([
  'Default',
  'GeoRSSImage',
  'GeoRSSLink',
  'OSM',
  'Route',
  'Table',
  'Wikipedia',
]);
export type PopupContentStyle = z.infer<typeof PopupContentStyleSchema>;

// Specifies the preference of the route
//
// Specifies the profile of the route

export const PreferenceSchema = z.enum([
  'cycling-regular',
  'driving-car',
  'foot-hiking',
  'foot-walking',
  'wheelchair',
]);
export type Preference = z.infer<typeof PreferenceSchema>;

// Text position

export const TextPathPositionSchema = z.enum(['center', 'end', 'start']);
export type TextPathPosition = z.infer<typeof TextPathPositionSchema>;

export const FeatureTypeSchema = z.enum(['Feature']);
export type FeatureType = z.infer<typeof FeatureTypeSchema>;

export const LayerTypeSchema = z.enum(['FeatureCollection']);
export type LayerType = z.infer<typeof LayerTypeSchema>;

export const EditModeSchema = z.enum(['advanced', 'disabled', 'simple']);
export type EditMode = z.infer<typeof EditModeSchema>;

export const KeySchema = z.enum(['description', 'fid', 'name']);
export type Key = z.infer<typeof KeySchema>;

export const FieldTypeSchema = z.enum(['String', 'Text']);
export type FieldType = z.infer<typeof FieldTypeSchema>;

export const DataFormatSchema = z.enum(['csv', 'geojson', 'georss', 'gpx', 'kml', 'osm']);
export type DataFormat = z.infer<typeof DataFormatSchema>;

export const UMapGeometrySchema = z.object({
  coordinates: z.array(z.number()),
  type: z.string(),
});
export type UMapGeometry = z.infer<typeof UMapGeometrySchema>;

export const GeometryElementSchema = z.object({
  bbox: z.array(z.number()).optional(),
  coordinates: z.array(
    z.union([z.array(z.union([z.array(z.union([z.array(z.number()), z.number()])), z.number()])), z.number()])
  ),
  type: GeometryTypeSchema,
});
export type GeometryElement = z.infer<typeof GeometryElementSchema>;

export const RouteSchema = z.object({
  active: z.boolean().optional(),
  coordinates: z.array(z.number()).optional(),
  elevation: z.boolean().optional(),
  preference: PreferenceSchema.optional(),
  profile: PreferenceSchema.optional(),
});
export type Route = z.infer<typeof RouteSchema>;

export const FieldSchema = z.object({
  key: KeySchema,
  type: FieldTypeSchema,
});
export type Field = z.infer<typeof FieldSchema>;

export const UmapOptionsLimitBoundsSchema = z.object({
  east: z.string().optional(),
  north: z.string().optional(),
  south: z.string().optional(),
  west: z.string().optional(),
});
export type UmapOptionsLimitBounds = z.infer<typeof UmapOptionsLimitBoundsSchema>;

export const RemoteDataSchema = z.object({
  dynamic: z.boolean().optional(),
  format: z.union([DataFormatSchema, z.null()]).optional(),
  from: z.number().optional(),
  licence: z.string().optional(),
  proxy: z.boolean().optional(),
  to: z.number().optional(),
  ttl: z.union([z.number(), z.number(), z.null()]).optional(),
  url: z.string().optional(),
});
export type RemoteData = z.infer<typeof RemoteDataSchema>;

export const CenterSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});
export type Center = z.infer<typeof CenterSchema>;

export const LicenceSchema = z.object({
  name: z.string(),
  url: z.string(),
});
export type Licence = z.infer<typeof LicenceSchema>;

export const OverlayClassSchema = z.object({});
export type OverlayClass = z.infer<typeof OverlayClassSchema>;

export const GeoJsonSchema = z.object({
  bbox: z.array(z.number()).optional(),
  coordinates: z
    .array(
      z.union([
        z.array(z.union([z.array(z.union([z.array(z.number()), z.number()])), z.number()])),
        z.number(),
      ])
    )
    .optional(),
  type: GeoJsonPointTypeSchema,
  geometries: z.array(GeometryElementSchema).optional(),
});
export type GeoJson = z.infer<typeof GeoJsonSchema>;

export const PropertiesUmapOptionsSchema = z.object({
  color: z.string().optional(),
  dashArray: z.string().optional(),
  fill: z.boolean().optional(),
  fillColor: z.string().optional(),
  fillOpacity: z.any().optional(),
  iconClass: IconShapeSchema.optional(),
  iconOpacity: z.number().optional(),
  iconSize: z.number().optional(),
  iconUrl: z.string().optional(),
  interactive: z.boolean().optional(),
  labelDirection: LabelDirectionSchema.optional(),
  labelInteractive: z.boolean().optional(),
  labelKey: z.string().optional(),
  mask: z.boolean().optional(),
  opacity: z.number().optional(),
  outlink: z.string().optional(),
  outlinkTarget: OpenLinkInSchema.optional(),
  popupShape: PopupShapeSchema.optional(),
  popupTemplate: PopupContentStyleSchema.optional(),
  route: RouteSchema.optional(),
  showLabel: z.boolean().optional(),
  smoothFactor: z.number().optional(),
  stroke: z.boolean().optional(),
  textPath: z.string().optional(),
  textPathColor: z.string().optional(),
  textPathOffset: z.number().optional(),
  textPathPosition: TextPathPositionSchema.optional(),
  textPathRepeat: z.boolean().optional(),
  textPathRotate: z.number().optional(),
  textPathSize: z.number().optional(),
  weight: z.number().optional(),
  zoomTo: z.number().optional(),
});
export type PropertiesUmapOptions = z.infer<typeof PropertiesUmapOptionsSchema>;

export const LayerUmapOptionsSchema = z.object({
  browsable: z.boolean(),
  displayOnLoad: z.boolean(),
  editMode: EditModeSchema,
  fields: z.array(FieldSchema),
  inCaption: z.boolean(),
  limitBounds: UmapOptionsLimitBoundsSchema.optional(),
  name: z.string(),
  rank: z.number(),
  remoteData: RemoteDataSchema,
  showLabel: z.null().optional(),
});
export type LayerUmapOptions = z.infer<typeof LayerUmapOptionsSchema>;

export const UMapPropertiesSchema = z.object({
  center: CenterSchema,
  description: z.string(),
  fields: z.array(z.any()),
  fullscreenControl: z.boolean(),
  licence: LicenceSchema,
  limitBounds: OverlayClassSchema,
  name: z.string(),
  onLoadPanel: z.string(),
  overlay: OverlayClassSchema,
  showLabel: z.null(),
  slideshow: OverlayClassSchema,
  tags: z.array(z.string()),
  tilelayer: OverlayClassSchema,
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
  type: FeatureTypeSchema,
});
export type GeoJsonFeature = z.infer<typeof GeoJsonFeatureSchema>;

export const UMapLayerGeoJsonFeatureCollectionSchema = z.object({
  _umap_options: LayerUmapOptionsSchema.optional(),
  bbox: z.array(z.number()).optional(),
  features: z.array(GeoJsonFeatureSchema),
  type: LayerTypeSchema,
});
export type UMapLayerGeoJsonFeatureCollection = z.infer<typeof UMapLayerGeoJsonFeatureCollectionSchema>;

export const UMapZodSchema = z.object({
  geometry: UMapGeometrySchema,
  layers: z.array(UMapLayerGeoJsonFeatureCollectionSchema),
  properties: UMapPropertiesSchema,
  type: z.string(),
  uri: z.string(),
});
export type UMapZod = z.infer<typeof UMapZodSchema>;
