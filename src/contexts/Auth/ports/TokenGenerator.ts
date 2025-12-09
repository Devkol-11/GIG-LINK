export interface ITokenGenerator {
        generateAccessToken(payload: object): string;

        generateRefreshToken(payload: object): string;

        verifyAccessToken(token: string): any;

        verifyRefreshToken(token: string): any;
}
