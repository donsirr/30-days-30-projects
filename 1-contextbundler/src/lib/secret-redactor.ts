/**
 * Secret Redaction Engine
 * Scans and redacts sensitive values from code content
 */

// Regex pattern for common secret patterns
const SECRET_PATTERNS = [
    // API keys and secrets
    /(?:API_KEY|APIKEY|API_SECRET)\s*[:=]\s*["']?([^"'\s,\n]+)["']?/gi,
    // Generic secrets and passwords
    /(?:SECRET|PASSWORD|PASSWD|PWD)\s*[:=]\s*["']?([^"'\s,\n]+)["']?/gi,
    // Tokens
    /(?:TOKEN|ACCESS_TOKEN|AUTH_TOKEN|BEARER)\s*[:=]\s*["']?([^"'\s,\n]+)["']?/gi,
    // Credentials and private keys
    /(?:CREDENTIALS|PRIVATE_KEY|PRIVATEKEY|SECRET_KEY|SECRETKEY)\s*[:=]\s*["']?([^"'\s,\n]+)["']?/gi,
    // Database URLs with credentials
    /(?:DATABASE_URL|DB_URL|MONGODB_URI|POSTGRES_URL)\s*[:=]\s*["']?([^"'\s,\n]+)["']?/gi,
    // AWS credentials
    /(?:AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY)\s*[:=]\s*["']?([^"'\s,\n]+)["']?/gi,
    // Generic connection strings
    /(?:CONNECTION_STRING|CONN_STRING)\s*[:=]\s*["']?([^"'\s,\n]+)["']?/gi,
    // OAuth secrets
    /(?:CLIENT_SECRET|OAUTH_SECRET)\s*[:=]\s*["']?([^"'\s,\n]+)["']?/gi,
    // Encryption keys
    /(?:ENCRYPTION_KEY|ENCRYPT_KEY|SIGNING_KEY)\s*[:=]\s*["']?([^"'\s,\n]+)["']?/gi,
    // Webhook secrets
    /(?:WEBHOOK_SECRET|STRIPE_SECRET|GITHUB_SECRET)\s*[:=]\s*["']?([^"'\s,\n]+)["']?/gi,
];

// Pattern to match actual secret-looking values (long alphanumeric strings)
const VALUE_LOOKS_LIKE_SECRET = /^[A-Za-z0-9+/=_-]{16,}$/;

/**
 * Redact secrets from content
 * Keeps the key name but replaces the value with [REDACTED]
 */
export function redactSecrets(content: string): {
    redactedContent: string;
    redactionCount: number
} {
    let redactedContent = content;
    let redactionCount = 0;

    for (const pattern of SECRET_PATTERNS) {
        // Reset regex state
        pattern.lastIndex = 0;

        redactedContent = redactedContent.replace(pattern, (match, value) => {
            // Only redact if the value looks like an actual secret
            if (value && value.length > 3 && value !== 'undefined' && value !== 'null') {
                redactionCount++;
                // Preserve the key and replace value
                return match.replace(value, '[REDACTED]');
            }
            return match;
        });
    }

    // Also check for inline environment variable patterns in .env files
    const envPattern = /^([A-Z_]+)\s*=\s*(.+)$/gm;
    const sensitiveEnvKeys = [
        'KEY', 'SECRET', 'PASSWORD', 'TOKEN', 'CREDENTIAL', 'PRIVATE',
        'AUTH', 'APIKEY', 'API_KEY', 'ACCESS', 'BEARER'
    ];

    redactedContent = redactedContent.replace(envPattern, (match, key, value) => {
        const keyUpper = key.toUpperCase();
        const isSensitive = sensitiveEnvKeys.some(s => keyUpper.includes(s));

        if (isSensitive && value && value.trim().length > 3) {
            redactionCount++;
            return `${key}=[REDACTED]`;
        }
        return match;
    });

    return { redactedContent, redactionCount };
}

/**
 * Check if a file is likely to contain secrets
 */
export function isSecretFile(filename: string): boolean {
    const secretFilePatterns = [
        /\.env$/i,
        /\.env\..+$/i,
        /secrets?\.(json|ya?ml|toml)$/i,
        /credentials?\.(json|ya?ml|toml)$/i,
        /config\.local\./i,
    ];

    return secretFilePatterns.some(p => p.test(filename));
}
