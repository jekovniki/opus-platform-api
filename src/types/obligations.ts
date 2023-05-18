import z from 'zod';

export const manualObligationSchema = z.object({
    createdAt: z.string(),
    currentAmount: z.number(),
    fundId: z.string(),
    instrumentsAsString: z.string(),
    minAmount: z.number(),
    noticePeriodExpiration: z.string(),
    status: z.string(),
    type: z.string(),
    violation: z.boolean(),
    message: z.string()
});

export const obligationStatusSchema = z.object({
    id: z.string(),
    status: z.string()
})

export type TManualObligation = z.infer<typeof manualObligationSchema>;
export type TObligationStatus = z.infer<typeof obligationStatusSchema>;