export type UmapFile = {
  geometry: UMap2Geometry;
  layers: UMapLayerGeoJSONFeatureCollection[];
  properties: UMap2Properties;
  type: string;
  uri: string;
};

export type UMap2Geometry = {
  coordinates: number[];
  type: string;
};

export type UMapLayerGeoJSONFeatureCollection = {
  _umap_options?: LayerUmapOptions;
  bbox?: number[];
  features: GeoJSONFeature[];
  type: 'FeatureCollection';
  [property: string]: any;
};

export type LayerUmapOptions = {
  /**
   * Set it to false to hide this layer from the slideshow, the data browser, the popup
   * navigation…
   */
  browsable: boolean;
  description?: string;
  displayOnLoad: boolean;
  editMode: EditMode;
  fields: CustomUserFields[];
  inCaption: boolean;
  /**
   * The name of the property to use as layer label (eg.: "nom"). You can also use properties
   * inside brackets to use more than one or mix with static content (eg.: "&lcub;name&rcub;
   * in &lcub;place&rcub;")
   */
  labelKey?: string;
  limitBounds?: LimitBoundsObject;
  name: string;
  rank: number;
  remoteData: RemoteData;
  /**
   * Whether to display a label on the layer. Choices: 'always' (true), 'never' (false), or
   * 'on hover' (null). Default is 'never'.
   */
  showLabel?: boolean;
};

export type EditMode = 'advanced' | 'simple' | 'disabled';

export type CustomUserFields = {
  key: string;
  type: FieldType;
};

export type FieldType =
  | 'String'
  | 'Text'
  | 'Number'
  | 'Datetime'
  | 'Date'
  | 'Boolean'
  | 'Enum';

export type LimitBoundsObject = {
  east?: string;
  north?: string;
  south?: string;
  west?: string;
  [property: string]: any;
};

export type RemoteData = {
  /**
   * Fetch data each time map view changes.
   */
  dynamic?: boolean;
  format?: DataFormat | null;
  from?: number;
  /**
   * Please be sure the licence is compliant with your use.
   */
  licence?: string;
  /**
   * To use if remote server doesn't allow cross domain (slower)
   */
  proxy?: boolean;
  to?: number;
  ttl?: number | number | null;
  url?: string;
  [property: string]: any;
};

export type DataFormat = 'geojson' | 'osm' | 'csv' | 'gpx' | 'kml' | 'georss';

export type GeoJSONFeature = {
  bbox?: number[];
  geometry: null | GeoJSON;
  id?: number | string;
  properties: FeatureProperties;
  type: 'Feature';
  [property: string]: any;
};

export type GeoJSON = {
  bbox?: number[];
  coordinates?: Array<Array<Array<number[] | number> | number> | number>;
  type: GeoJSONPointType;
  geometries?: GeometryElement[];
  [property: string]: any;
};

export type GeometryElement = {
  bbox?: number[];
  coordinates: Array<Array<Array<number[] | number> | number> | number>;
  type: GeometryType;
  [property: string]: any;
};

export type GeometryType =
  | 'Point'
  | 'LineString'
  | 'Polygon'
  | 'MultiPoint'
  | 'MultiLineString'
  | 'MultiPolygon';

export type GeoJSONPointType =
  | 'Point'
  | 'LineString'
  | 'Polygon'
  | 'MultiPoint'
  | 'MultiLineString'
  | 'MultiPolygon'
  | 'GeometryCollection';

export type FeatureProperties = {
  _umap_options?: PropertiesUmapOptions;
  fid?: number;
  name?: string;
  [property: string]: any;
};

export type PropertiesUmapOptions = {
  /**
   * Color value
   */
  color?: string;
  /**
   * A comma separated list of numbers that defines the stroke dash pattern. Ex.: "5, 10, 15".
   */
  dashArray?: string;
  /**
   * Whether to fill polygons with color.
   */
  fill?: boolean;
  /**
   * Optional. Same as color if not set.
   */
  fillColor?: string;
  fillOpacity?: any;
  /**
   * Icon shape
   */
  iconClass?: IconShape;
  /**
   * Icon opacity
   */
  iconOpacity?: number;
  /**
   * Icon size. Will only affect raw and large circle icons.
   */
  iconSize?: number;
  /**
   * Icon symbol
   */
  iconUrl?: string;
  /**
   * If false, the polygon or line will act as a part of the underlying map.
   */
  interactive?: boolean;
  /**
   * The direction in which the label is displayed.
   */
  labelDirection?: LabelDirection;
  /**
   * Whether the label should be interactive.
   */
  labelInteractive?: boolean;
  /**
   * The name of the property to use as feature label (eg.: "nom"). You can also use
   * properties inside brackets to use more than one or mix with static content (eg.:
   * "&lcub;name&rcub; in &lcub;place&rcub;")
   */
  labelKey?: string;
  /**
   * Display the polygon inverted
   */
  mask?: boolean;
  /**
   * Opacity value
   */
  opacity?: number;
  /**
   * Define link to open in a new window on polygon click.
   */
  outlink?: string;
  outlinkTarget?: OpenLinkIn;
  /**
   * Define the shape of the popup.  \nDefault: Popup  \nLarge: Popup (large)  \nPanel: Side
   * panel
   */
  popupShape?: PopupShape;
  /**
   * Define the style of the popup content.
   */
  popupTemplate?: PopupContentStyle;
  route?: Route;
  /**
   * Whether to display a label on the feature. Choices: 'always' (true), 'never' (false), or
   * 'on hover' (null). Default is 'never'.
   */
  showLabel?: boolean;
  /**
   * How much to simplify the polyline on each zoom level (more = better performance and
   * smoother look, less = more accurate)
   */
  smoothFactor?: number;
  /**
   * Whether to display or not polygons paths.
   */
  stroke?: boolean;
  /**
   * Add text along path
   */
  textPath?: string;
  /**
   * Text color
   */
  textPathColor?: string;
  /**
   * Text offset
   */
  textPathOffset?: number;
  /**
   * Text position
   */
  textPathPosition?: TextPathPosition;
  /**
   * Text repeat
   */
  textPathRepeat?: boolean;
  /**
   * Text rotate
   */
  textPathRotate?: number;
  /**
   * Text size
   */
  textPathSize?: number;
  /**
   * Weight value
   */
  weight?: number;
  /**
   * Zoom level for automatic zooms
   */
  zoomTo?: number;
};

/**
 * Icon shape
 */
export type IconShape =
  | 'Default'
  | 'Circle'
  | 'LargeCircle'
  | 'Drop'
  | 'Ball'
  | 'Raw';

/**
 * The direction in which the label is displayed.
 */
export type LabelDirection = 'auto' | 'left' | 'right' | 'top' | 'bottom';

export type OpenLinkIn = 'blank' | 'self' | 'parent';

/**
 * Define the shape of the popup.  \nDefault: Popup  \nLarge: Popup (large)  \nPanel: Side
 * panel
 */
export type PopupShape = 'Default' | 'Large' | 'Panel';

/**
 * Define the style of the popup content.
 */
export type PopupContentStyle =
  | 'Default'
  | 'Table'
  | 'GeoRSSImage'
  | 'GeoRSSLink'
  | 'OSM'
  | 'Wikipedia'
  | 'Route';

export type Route = {
  /**
   * Indicates whether the route is active
   */
  active?: boolean;
  /**
   * Array of coordinates for the route
   */
  coordinates?: number[];
  /**
   * Indicates whether elevation data is included
   */
  elevation?: boolean;
  /**
   * Specifies the preference of the route
   */
  preference?: Preference;
  /**
   * Specifies the profile of the route
   */
  profile?: Preference;
  [property: string]: any;
};

/**
 * Specifies the preference of the route
 *
 * Specifies the profile of the route
 */
export type Preference =
  | 'foot-walking'
  | 'foot-hiking'
  | 'driving-car'
  | 'cycling-regular'
  | 'wheelchair';

/**
 * Text position
 */
export type TextPathPosition = 'start' | 'center' | 'end';

export type UMap2Properties = {
  captionBar: boolean;
  captionControl: boolean;
  center: Center;
  datalayersControl: boolean;
  description: string;
  displayPopupFooter: boolean;
  easing: boolean;
  editinosmControl: null;
  embedControl: null;
  fields: any[];
  fullscreenControl: null;
  homeControl: boolean;
  labelInteractive: boolean;
  licence: Licence;
  limitBounds: LimitBoundsClass;
  locateControl: null;
  longCredit: string;
  measureControl: null;
  miniMap: boolean;
  moreControl: boolean;
  name: string;
  onLoadPanel: string;
  overlay: { [key: string]: any };
  permanentCredit: string;
  printControl: null;
  scaleControl: boolean;
  scrollWheelZoom: boolean;
  shortCredit: string;
  showLabel: null;
  slideshow: { [key: string]: any };
  tags: string[];
  tilelayer: { [key: string]: any };
  zoom: number;
  zoomControl: boolean;
};

export type Center = {
  lat: number;
  lng: number;
};

export type Licence = {
  name: string;
  url: string;
};

export type LimitBoundsClass = {
  east: number;
  north: number;
  south: number;
  west: number;
};
