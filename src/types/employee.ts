import z from 'zod';

export const employeeStatusSchema = z.object({
    email: z.string(),
    status: z.string()
});

export type TEmployeeStatus = z.infer<typeof employeeStatusSchema>;