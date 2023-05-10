import z from 'zod';

export const newInstrumentSchema = z.object({
    code: z.string(),
});

export type TInstrumentCode = z.infer<typeof newInstrumentSchema>;