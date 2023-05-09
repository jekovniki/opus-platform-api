import z from 'zod';

export const registrationSchema = z.object({
    email: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
    agreedTerms: z.boolean(),
    phoneNumber: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    job: z.string(),
    companyUic: z.string(),
    picture: z.string()
});

export const loginSchema = z.object({
    email: z.string(),
    password: z.string()
});

export type TRegistrationSchema = z.infer<typeof registrationSchema>;
export type TLoginSchema = z.infer<typeof loginSchema>;