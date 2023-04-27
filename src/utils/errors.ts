import { IBaseResponse } from "../interfaces/base"
import { logger } from "../libs/logger"
import { SERVER } from "./constants/status-codes"

export function handleErrors(error:unknown): IBaseResponse {
    if (error instanceof Error) {
        logger.error(error)

        return {
            success: false,
            message: error.message
        }
    }

    return {
        success: false,
        message: SERVER.ERROR.MESSAGE
    }
}