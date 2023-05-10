import z from 'zod';

export const mutualFundSchema = z.object({
    managementCompanyId: z.string(),
    employeeId: z.string(),
    uic: z.string(),
    type: z.string(),
    name: z.string(),
});

export const assignInstrumentToFundSchema = z.object({
    fundId: z.string(),
    instruments: z.array(z.object({
        code: z.string(),
        amount: z.number()
    }))
})

export type TMutualFund = z.infer<typeof mutualFundSchema>;
export type  TFundInstruments = z.infer<typeof assignInstrumentToFundSchema>