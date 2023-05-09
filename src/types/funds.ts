import z from 'zod';

export const mutualFundSchema = z.object({
    managementCompanyId: z.string(),
    employeeId: z.string(),
    uic: z.string(),
    type: z.string(),
    name: z.string(),
});

export type TMutualFund = z.infer<typeof mutualFundSchema>;