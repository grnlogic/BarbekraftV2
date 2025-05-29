/**
 * Utility to debug environment variables
 */
const envCheck = {
  /**
   * Get an environment variable with a fallback
   */
  get: (key: string, fallback: string = ""): string => {
    const value = process.env[key];
    if (!value) {
      return fallback;
    }
    return value;
  },

  /**
   * Log all REACT_APP environment variables (without exposing actual values)
   */
  logAvailable: (): void => {
    // Function kept for compatibility but no longer logs
  },
};

export default envCheck;
