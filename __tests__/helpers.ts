import { countBusinessDays } from "../src/utils/helpers"

describe('Helpers', () => {
    test('+ countBusinessDays | should return the exact amount for September business days', () => {
        const result = countBusinessDays('2023-09-01', '2023-09-30');

        expect(result).toStrictEqual(19);
    });
    test('+ countBusinessDays | should return the exact amount for December business days', () => {
        const result = countBusinessDays('2023-12-01', '2023-12-31');

        expect(result).toStrictEqual(18);
    })
})