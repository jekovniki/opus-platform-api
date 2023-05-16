import bcrypt from 'bcrypt';
import { v4 } from 'uuid'; 
import { ENVIRONMENT_VARIABLE } from "./constants/errors";
import { USER, USER_BEHAVIOR_ERRORS } from "./constants/user";
import { HOLIDAYS_IN_BULGARIA_2023 } from './constants/user';

export function validateEnvironmentVariable(variable: string | undefined): string {
    if (typeof variable === 'undefined') {
        throw new Error(ENVIRONMENT_VARIABLE);
    }

    return variable;
}

export function validatePasswordLength(password: string): void {
    if (password.length < USER.MIN_PASSWORD_LENGTH) {
        throw USER_BEHAVIOR_ERRORS.PASSWORD_TOO_SHORT;
    }
}

export function hasNumberInString(string: string): boolean {
    return /[0-9]/.test(string);
}

export function hasUppercaseInString(string: string): boolean {
    return /[A-Z]/.test(string);
}

export function hasSpecialSymbolInString(string: string): boolean {
    return /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(string);
}

export function hasOnlyNumbersAndPhoneSymbols(string: string): boolean {
    return /^[0-9+\-]+$/.test(string);
}

export function generateHash(password: string, saltRounds: number): string {
    const salt = bcrypt.genSaltSync(saltRounds);

    return bcrypt.hashSync(password, salt);
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<void> {
    try {
        
        const compare = await bcrypt.compare(password, hashedPassword);

        if (!compare) {
            throw new Error(USER_BEHAVIOR_ERRORS.INVALID_CREDENTIALS);
        }
          
    } catch (error:any) {
        throw new Error(error.message);
    }
    
}

export function generateUUIDv4(): string {
    return v4();
}

export function addHoursToCurrentTime(hour: number): number {
    const currentTime = new Date().getTime();

    return new Date(currentTime + hour * 60 * 60 * 1000).getTime();
}

export function isValueInObject(object: Record<string, any>, value: string): boolean {
    if (Object.values(object).indexOf(value) > -1) {
        return true;
    }

    return false;
}

export function isObjectEmpty(object: Record<string, any>): boolean {
    return Object.keys(object).length === 0;
}

export function countEndDateByBusinessDays(startDate: string | number, businessDays: number, holidays: Array<number[]> = HOLIDAYS_IN_BULGARIA_2023): string {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    let currentDate = new Date(startDate);
    let count = 0;

    while (count <= businessDays) {
        currentDate = new Date(currentDate.getTime() + millisecondsPerDay); // Move to the next day

        // Check if the current day is a business day (Monday to Friday) and not a holiday
        const dayOfWeek = currentDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isHoliday = holidays.some(([month, day]) => currentDate.getMonth() === month && currentDate.getDate() === day);

        if (!isWeekend && !isHoliday) {
        count++; // Increment the counter for business days
        }
    }

    return currentDate.toISOString().slice(0, 10);
}

export function calculatePercentage(number: number, totalAmount: number): number {

  return (number/totalAmount)*100;
}

export function separateArrayByProperties(array: Array<Record<string, any>>, property: string) {
    return array.reduce((memo, x) => {
        if (!memo[x[property]]) { memo[x[property]] = []}
        memo[x[property]].push(x);

        return memo;
    }, {});
}