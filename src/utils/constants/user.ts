export const USER_BEHAVIOR_ERRORS = {
    USER_EXISTS: 'User with that email already exists',
    TERMS_NOT_ACCEPTED: 'Terms and privacy policy should be accepted in order to proceed with the registration',
    NOT_AN_EMAIL: 'The entered value is not an email address!',
    INVALID_SYMBOL: 'Invalid symbol in email address',
    PASSWORD_TOO_SHORT: 'Password too short',
    PASSWORD_TOO_WEAK: 'Password is missing some of the required symbols',
    NOT_MATCHING: 'Password and Confirm password are not matching',
    INVALID_CREDENTIALS: 'Email and password are not correct',
    SOCIAL_SIGN_IN: 'This user is registered with one of our social sign-ins. Please use them to log in'
}

export const USER = {
    MIN_PASSWORD_LENGTH: 8,
    PASSWORD_SALT_ROUNDS: 10,
    EMAIL_SYMBOL: '@',
    ALLOWED_EMAIL_SYMBOLS: /^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
}