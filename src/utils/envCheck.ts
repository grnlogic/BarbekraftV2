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
      console.warn(
        `Environment variable ${key} not found, using fallback value`
      );
      return fallback;
    }
    return value;
  },

  /**
   * Log all REACT_APP environment variables (without exposing actual values)
   */
  logAvailable: (): void => {
    console.log("Available environment variables:");
    Object.keys(process.env)
      .filter((key) => key.startsWith("REACT_APP_"))
      .forEach((key) => {
        const value = process.env[key];
        const masked = value ? "✓ [Set]" : "✗ [Not set]";
        console.log(`- ${key}: ${masked}`);
      });
  },
};

export default envCheck;
