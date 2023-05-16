export const FUND_INVESTMENT_RULES_BG: Record<string, any> = {
    CLOSE_END_PUBLIC_CONTRACT_FUNDS: {
        MAX_SINGLE_INVESTMENT_PERCENTAGE: 10,
        MAX_SECTOR_INVESTMENT_PERCENTAGE: 25,
        MIN_AMOUNT_OF_DIVERSIFICATION: 10
    },
    OPEN_PUBLIC_CONTRACT_FUNDS: {
        MAX_SINGLE_INVESTMENT_PERCENTAGE: 10,
        MAX_SECTOR_INVESTMENT_PERCENTAGE: 25,
        MIN_AMOUNT_OF_DIVERSIFICATION: 10
    }
}

export const OBLIGATION_TYPES = {
    MAX_SINGLE_INVESTMENT_PERCENTAGE: 'MAX_SINGLE_INVESTMENT_PERCENTAGE',
    MAX_SECTOR_INVESTMENT_PERCENTAGE: 'MAX_SECTOR_INVESTMENT_PERCENTAGE',
    MIN_AMOUNT_OF_DIVERSIFICATION: 'MIN_AMOUNT_OF_DIVERSIFICATION'
}

export const OBLIGATION_STATUS: Record<string, string> = {
    COMPLETED: 'COMPLETED',
    PENDING: 'PENDING',
    CANCELED: 'CANCELED'
}