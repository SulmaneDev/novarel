/**
 * Converts data to humanize name
 * @param {any} data 
 * @returns {string}
 */
export const toHumanizeName = (data) => {
    if (data === null || data === undefined) {
        return "Unknown";
    }

    if (typeof data === "string") {
        return data || "Unknown";
    }

    if (typeof data === "symbol") {
        return data.description || "Symbol";
    }

    if (typeof data === "function") {
        return data.name || "AnonymousFunction";
    }

    if (Array.isArray(data)) {
        return "Array";
    }

    if (typeof data === "bigint") {
        return data.toString();
    }

    if (typeof data === "number") {
        return Number.isNaN(data) ? "NaN" : data.toString();
    }

    if (typeof data === "boolean") {
        return data ? "true" : "false";
    }

    if (typeof data === "object") {
        if (data.constructor && data.constructor.name) {
            return data.constructor.name;
        }
        return "Object";
    }

    return "Unknown";
};

