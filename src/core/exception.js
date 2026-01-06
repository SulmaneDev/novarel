/**
 * The `NovarelException` class is used to create a custom exception in the application.
 * @license MIT
 * @author Muhammad Sulman <https://github.com/SulmaneDev>
 * @version 0.1.0
 */
export class NovarelException extends Error {
    /**
     * @param {string} message
     * @param {number} statusCode
     * @param {string} errorCode
     * @param {object} context
     */
    constructor(message, statusCode = 500, errorCode = "E_UNKNOWN", context = {}) {
        super(message);
        this.name = "NovarelException";
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.context = context;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NovarelException);
        }
    }

    /**
     * Convert exception to a JSON-serializable object
     * @returns {object}
     */
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            errorCode: this.errorCode,
            context: this.context,
            stack: this.stack,
        };
    }
}

