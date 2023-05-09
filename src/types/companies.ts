import z from 'zod';

export const managementCompanySchema = z.object({
    uic: z.string(),
    employeeId: z.string(),
    name: z.string(),
    type: z.string(),
    website: z.string(),
    phone: z.string(),
    ceo: z.string(),
});

export type TManagementCompany = z.infer<typeof managementCompanySchema>;