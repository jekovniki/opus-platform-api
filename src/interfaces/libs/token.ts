export interface IdentityTokenPayload {
    id: string | undefined;
    sessionId: string | undefined;
}

export interface IdentityTokenPayloadSuccess extends IdentityTokenPayload {
    success: boolean;
}