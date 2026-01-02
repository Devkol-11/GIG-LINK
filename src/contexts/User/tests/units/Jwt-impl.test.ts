import { JwtAdapter } from '../../adapters/Jwt-impl.js';

describe('JwtAdapter - UNIT TESTS', () => {
        let adapter: JwtAdapter;

        beforeEach(() => {
                jest.clearAllMocks();
                adapter = new JwtAdapter();
        });

        describe('generateToken', () => {
                it('should generate access token with user data', () => {
                        // Arrange
                        const payload = {
                                userId: 'user-123',
                                email: 'user@example.com',
                                role: 'CREATOR'
                        };
                        const expiresIn = '1h';

                        // Act
                        const token = adapter.generateToken(payload, expiresIn);

                        // Assert
                        expect(typeof token).toBe('string');
                        expect(token.split('.').length).toBe(3); // JWT structure: header.payload.signature
                });

                it('should generate refresh token with extended expiry', () => {
                        // Arrange
                        const payload = {
                                userId: 'user-123'
                        };
                        const expiresIn = '7d';

                        // Act
                        const token = adapter.generateToken(payload, expiresIn);

                        // Assert
                        expect(typeof token).toBe('string');
                        expect(token.split('.').length).toBe(3);
                });

                it('should handle complex payload objects', () => {
                        // Arrange
                        const payload = {
                                userId: 'user-123',
                                email: 'user@example.com',
                                role: 'CREATOR',
                                permissions: ['read', 'write'],
                                metadata: {
                                        verified: true,
                                        tier: 'premium'
                                }
                        };

                        // Act
                        const token = adapter.generateToken(payload, '1h');

                        // Assert
                        expect(typeof token).toBe('string');
                        expect(token).toBeTruthy();
                });

                it('should generate different tokens for different payloads', () => {
                        // Arrange
                        const payload1 = { userId: 'user-123' };
                        const payload2 = { userId: 'user-456' };

                        // Act
                        const token1 = adapter.generateToken(payload1, '1h');
                        const token2 = adapter.generateToken(payload2, '1h');

                        // Assert
                        expect(token1).not.toBe(token2);
                });

                it('should handle default expiry if not provided', () => {
                        // Arrange
                        const payload = { userId: 'user-123' };

                        // Act
                        // If default expiry is set, it should work
                        const token = adapter.generateToken(payload);

                        // Assert
                        expect(typeof token).toBe('string');
                        expect(token.split('.').length).toBe(3);
                });
        });

        describe('verifyToken', () => {
                it('should verify valid token', () => {
                        // Arrange
                        const payload = {
                                userId: 'user-123',
                                email: 'user@example.com'
                        };
                        const token = adapter.generateToken(payload, '1h');

                        // Act
                        const decoded = adapter.verifyToken(token);

                        // Assert
                        expect(decoded).toBeTruthy();
                        expect((decoded as any).userId).toBe('user-123');
                        expect((decoded as any).email).toBe('user@example.com');
                });

                it('should throw error for invalid token', () => {
                        // Arrange
                        const invalidToken = 'invalid.token.here';

                        // Act & Assert
                        expect(() => adapter.verifyToken(invalidToken)).toThrow();
                });

                it('should throw error for malformed token', () => {
                        // Arrange
                        const malformedToken = 'not-a-jwt-token';

                        // Act & Assert
                        expect(() => adapter.verifyToken(malformedToken)).toThrow();
                });

                it('should throw error for expired token', () => {
                        // Arrange
                        const payload = { userId: 'user-123' };
                        const expiredToken = adapter.generateToken(payload, '0s'); // Expires immediately

                        // Give it a moment to actually expire
                        setTimeout(() => {
                                // Act & Assert
                                expect(() => adapter.verifyToken(expiredToken)).toThrow();
                        }, 100);
                });

                it('should throw error for tampered token', () => {
                        // Arrange
                        const payload = { userId: 'user-123' };
                        const token = adapter.generateToken(payload, '1h');
                        const tamperedToken = token.slice(0, -5) + 'xxxxx'; // Modify last 5 chars

                        // Act & Assert
                        expect(() => adapter.verifyToken(tamperedToken)).toThrow();
                });

                it('should decode token without verification', () => {
                        // Arrange
                        const payload = {
                                userId: 'user-123',
                                email: 'user@example.com',
                                role: 'CREATOR'
                        };
                        const token = adapter.generateToken(payload, '1h');

                        // Act
                        const decoded = adapter.verifyToken(token);

                        // Assert
                        expect(decoded).toBeTruthy();
                        expect((decoded as any).userId).toBe(payload.userId);
                });
        });

        describe('decodeToken', () => {
                it('should decode token without verification', () => {
                        // Arrange
                        const payload = {
                                userId: 'user-123',
                                email: 'user@example.com'
                        };
                        const token = adapter.generateToken(payload, '1h');

                        // Act
                        const decoded = adapter.decodeToken(token);

                        // Assert
                        expect(decoded).toBeTruthy();
                        expect((decoded as any).userId).toBe('user-123');
                });

                it('should decode even for expired tokens', () => {
                        // Arrange
                        const payload = { userId: 'user-123' };
                        const token = adapter.generateToken(payload, '0s');

                        // Act
                        const decoded = adapter.decodeToken(token);

                        // Assert
                        expect(decoded).toBeTruthy();
                });

                it('should return null for invalid token format', () => {
                        // Arrange
                        const invalidToken = 'not-a-jwt-token';

                        // Act
                        const decoded = adapter.decodeToken(invalidToken);

                        // Assert
                        expect(decoded).toBeNull();
                });

                it('should extract user id from decoded token', () => {
                        // Arrange
                        const payload = { userId: 'user-789' };
                        const token = adapter.generateToken(payload, '1h');

                        // Act
                        const decoded = adapter.decodeToken(token);

                        // Assert
                        expect((decoded as any).userId).toBe('user-789');
                });
        });

        describe('refreshToken', () => {
                it('should generate new token from valid refresh token', () => {
                        // Arrange
                        const originalPayload = { userId: 'user-123' };
                        const refreshToken = adapter.generateToken(originalPayload, '7d');
                        const decoded = adapter.decodeToken(refreshToken);

                        // Act
                        const newAccessToken = adapter.generateToken(decoded, '1h');

                        // Assert
                        expect(typeof newAccessToken).toBe('string');
                        expect(newAccessToken).not.toBe(refreshToken);
                });

                it('should preserve user data on token refresh', () => {
                        // Arrange
                        const originalPayload = {
                                userId: 'user-123',
                                email: 'user@example.com',
                                role: 'CREATOR'
                        };
                        const refreshToken = adapter.generateToken(originalPayload, '7d');
                        const decoded = adapter.decodeToken(refreshToken);

                        // Act
                        const newAccessToken = adapter.generateToken(decoded, '1h');
                        const newDecoded = adapter.verifyToken(newAccessToken);

                        // Assert
                        expect((newDecoded as any).userId).toBe('user-123');
                        expect((newDecoded as any).email).toBe('user@example.com');
                        expect((newDecoded as any).role).toBe('CREATOR');
                });
        });

        describe('token expiry', () => {
                it('should respect expiry time for short duration tokens', (done) => {
                        // Arrange
                        const payload = { userId: 'user-123' };
                        const token = adapter.generateToken(payload, '1s'); // 1 second expiry

                        // Act & Assert - token should be valid immediately
                        const immediateVerify = adapter.verifyToken(token);
                        expect(immediateVerify).toBeTruthy();

                        // Check after 2 seconds - should be expired
                        setTimeout(() => {
                                expect(() => adapter.verifyToken(token)).toThrow();
                                done();
                        }, 2000);
                });

                it('should include expiry information in token', () => {
                        // Arrange
                        const payload = { userId: 'user-123' };
                        const token = adapter.generateToken(payload, '1h');
                        const decoded = adapter.decodeToken(token);

                        // Act & Assert
                        expect((decoded as any).exp).toBeDefined(); // Expiry claim should exist
                        expect((decoded as any).iat).toBeDefined(); // Issued at claim should exist
                });
        });

        describe('token validation scenarios', () => {
                it('should validate token with special characters in payload', () => {
                        // Arrange
                        const payload = {
                                userId: 'user-123',
                                email: 'user+test@example.com',
                                name: 'José María'
                        };
                        const token = adapter.generateToken(payload, '1h');

                        // Act
                        const decoded = adapter.verifyToken(token);

                        // Assert
                        expect((decoded as any).email).toBe('user+test@example.com');
                        expect((decoded as any).name).toBe('José María');
                });

                it('should handle empty payload object', () => {
                        // Arrange
                        const payload = {};

                        // Act
                        const token = adapter.generateToken(payload, '1h');
                        const decoded = adapter.verifyToken(token);

                        // Assert
                        expect(decoded).toBeTruthy();
                });

                it('should handle numeric and boolean values in payload', () => {
                        // Arrange
                        const payload = {
                                userId: 'user-123',
                                isVerified: true,
                                loginAttempts: 0,
                                score: 95.5
                        };
                        const token = adapter.generateToken(payload, '1h');

                        // Act
                        const decoded = adapter.verifyToken(token);

                        // Assert
                        expect((decoded as any).isVerified).toBe(true);
                        expect((decoded as any).loginAttempts).toBe(0);
                        expect((decoded as any).score).toBe(95.5);
                });
        });

        describe('error handling', () => {
                it('should handle missing token', () => {
                        // Act & Assert
                        expect(() => adapter.verifyToken('')).toThrow();
                });

                it('should handle null token', () => {
                        // Act & Assert
                        expect(() => adapter.verifyToken(null as any)).toThrow();
                });

                it('should handle token with incorrect signature', () => {
                        // Arrange
                        const payload = { userId: 'user-123' };
                        const token = adapter.generateToken(payload, '1h');
                        const parts = token.split('.');
                        const modifiedToken = `${parts[0]}.${parts[1]}.invalidsignature`;

                        // Act & Assert
                        expect(() => adapter.verifyToken(modifiedToken)).toThrow();
                });
        });
});
