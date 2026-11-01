import { createHmac, timingSafeEqual } from "crypto"

export const rpName = 'Cordage'

export const rpID =
    process.env.NODE_ENV === 'production'
        ? 'gestion-cordage.com'
        : 'localhost'

export const origin =
    process.env.NODE_ENV === 'production'
        ? 'https://gestion-cordage.com'
        : 'http://localhost:3000'


function getChallengeSecret(): string {
    const secret = process.env.PASSKEY_CHALLENGE_SECRET

    if (!secret) {
        throw new Error('PASSKEY_CHALLENGE_SECRET is missing')
    }

    return secret
}

export function signChallenge(challenge: string): string {
    return createHmac('sha256', getChallengeSecret())
        .update(challenge)
        .digest('base64url')
}

export function verifyChallengeHmac(

    challenge: string,
    signature: string

): boolean {

    const expected = signChallenge(challenge)
    const expectedBuffer = Buffer.from(expected)
    const signatureBuffer = Buffer.from(signature)

    if (expectedBuffer.length !== signatureBuffer.length) {
        return false
    }
    return timingSafeEqual(expectedBuffer, signatureBuffer)

}