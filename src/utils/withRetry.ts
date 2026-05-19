/**
 * Wraps an async function with exponential backoff retry logic.
 * @param fn The async function to execute.
 * @param retries Maximum number of retries (default: 3).
 * @param delay Initial delay in milliseconds (default: 1000).
 */
export const withRetry = async <T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000,
): Promise<T> => {
    try {
        return await fn();
    } catch (error) {
        if (retries === 0) {
            throw error;
        }
        console.warn(
            `Request failed. Retrying in ${delay}ms... (${retries} retries left)`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        return withRetry(fn, retries - 1, delay * 2);
    }
};
