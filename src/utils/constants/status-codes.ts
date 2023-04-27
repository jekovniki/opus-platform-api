export const SUCCESS = {
    OK: {
        CODE: 200,
        MESSAGE: 'Ok'
    },
    CREATED: {
        CODE: 201,
        MESSAGE: 'Created'
    },
    ACCEPTED: {
        CODE: 202,
        MESSAGE: 'Accepted'
    },
    NO_CONTENT: {
        CODE: 204,
        MESSAGE: 'No content'
    }
}

export const ERRORS = {
    BAD_REQUEST: {
        CODE: 400,
        MESSAGE: 'Bad request'
    },
    UNAUTHORIZED: {
        CODE: 401,
        MESSAGE: 'Unauthorized'
    },
    FORBIDDEN: {
        CODE: 403,
        MESSAGE: 'Forbidden'
    },
    NOT_FOUND: {
        CODE: 404,
        MESSAGE: 'Not found'
    },
    NOT_ALLOWED: {
        CODE: 405,
        MESSAGE: 'Method not allowed'
    }
}

export const SERVER = {
    ERROR: {
        CODE: 500,
        MESSAGE: 'Internal server error'
    },
    NOT_IMPLEMENTED: {
        CODE: 501,
        MESSAGE: 'Not Implemented'
    }
}