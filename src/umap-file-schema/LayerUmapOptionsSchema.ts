import * as z from 'zod';

import { CustomUserFieldsSchema } from './CustomUserFieldsSchema';
import { LimitBoundsSchema } from './dependencies/LimitBoundsSchema';
import { RemoteDataSchema } from './dependencies/RemoteDataSchema';

export const LayerUmapOptionsSchema = z.object({
  browsable: z.boolean().meta({
    description:
      'Set it to false to hide this layer from the slideshow, the data browser, the popup navigation…',
  }),
  description: z.string().optional(),
  displayOnLoad: z.boolean(),
  editMode: z.enum(['advanced', 'disabled', 'simple']),
  fields: z.array(CustomUserFieldsSchema),
  inCaption: z.boolean(),
  labelKey: z
    .string()
    .optional()
    .meta({
      description: [
        'The name of the property to use as layer label (eg.: "nom").',
        'You can also use properties inside brackets to use more than one or mix with',
        'static content (eg.: "&lcub;name&rcub; in &lcub;place&rcub;")',
      ].join('\n'),
    }),
  limitBounds: LimitBoundsSchema.optional(),
  name: z.string(),
  rank: z.number(),
  remoteData: RemoteDataSchema,
  showLabel: z.boolean().optional().meta({
    description:
      "Whether to display a label on the layer. Choices: 'always' (true), 'never' (false), or 'on hover' (null). Default is 'never'.",
  }),
});
export type LayerUmapOptions = z.infer<typeof LayerUmapOptionsSchema>;
