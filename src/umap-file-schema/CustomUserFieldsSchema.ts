import * as z from 'zod';

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
