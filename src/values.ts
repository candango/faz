
export function toBoolean(value: string | null): boolean {
    if (value === null) {
        return false;
    }
    return value.toLowerCase() === "true";
}

export function randomId() {
    // SEE: https://gist.github.com/gordonbrander/2230317
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first
    // 9 characters
    // after the decimal.
    return "_" + Math.random().toString(36).substring(2, 11);
}
