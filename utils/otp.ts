import { Buffer } from 'buffer';
import { verify, generateSecret, generateURI } from 'otplib';

// Polyfill Buffer for otplib
if (typeof global.Buffer === 'undefined') {
    global.Buffer = Buffer;
}

/**
 * Validates a TOTP token against a secret.
 * @param token The 6-digit code from the authenticator app.
 * @param secret The user's TOTP secret stored in Firestore.
 * @returns boolean
 */
export const validateToken = async (token: string, secret: string) => {
    try {
        const result = await verify({
            secret,
            token,
            epochTolerance: 30,
        });
        return result;
    } catch (err) {
        console.error('TOTP Validation Error:', err);
        return false;
    }
};

/**
 * Generates a new TOTP secret for a user.
 * @param userEmail The user's email (used as label in the app).
 * @returns { secret: string, uri: string }
 */
export const generateTOTPSecret = (userEmail: string) => {
    const secret = generateSecret();

    const uri = generateURI({
        issuer: "MyService",
        label: userEmail,
        secret,
    })

    return { secret, uri };
};
