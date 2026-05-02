// Utility functions for handling authentication fallbacks

/**
 * Checks if the current environment is development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Gets a fallback user ID for development purposes
 */
export function getFallbackUserId(): string | null {
  // In development, we can use a placeholder user ID
  // In production, we should not provide fallback IDs
  if (isDevelopment()) {
    return 'fallback-user-id';
  }
  return null;
}

/**
 * Gets default roles for fallback scenarios
 */
export function getDefaultRoles(): Array<{id: number, name: string, description: string, created_at: string}> {
  // Return a default set of roles for fallback scenarios
  return [
    {
      id: 1,
      name: 'user',
      description: 'Default role for all authenticated users',
      created_at: new Date().toISOString()
    }
  ];
}

/**
 * Checks if we should use fallback authentication
 * This should only be used in development or for specific error recovery scenarios
 */
export function shouldUseAuthFallback(): boolean {
  // Only use fallback in development mode
  return isDevelopment();
}