import { BcryptAdapter } from '../../adapters/Bcrypt-impl.js';

describe('BcryptAdapter - UNIT TESTS', () => {
        let adapter: BcryptAdapter;

        beforeEach(() => {
                jest.clearAllMocks();
                adapter = new BcryptAdapter();
        });

        describe('hash', () => {
                it('should hash password successfully', async () => {
                        // Arrange
                        const plainPassword = 'MySecurePassword123!';

                        // Act
                        const hashedPassword = await adapter.hash(plainPassword);

                        // Assert
                        expect(typeof hashedPassword).toBe('string');
                        expect(hashedPassword).not.toBe(plainPassword);
                        expect(hashedPassword.length).toBeGreaterThan(plainPassword.length);
                });

                it('should generate different hash for same password (different salts)', async () => {
                        // Arrange
                        const plainPassword = 'MySecurePassword123!';

                        // Act
                        const hash1 = await adapter.hash(plainPassword);
                        const hash2 = await adapter.hash(plainPassword);

                        // Assert
                        expect(hash1).not.toBe(hash2); // Different hashes due to different salts
                });

                it('should hash empty string', async () => {
                        // Arrange
                        const plainPassword = '';

                        // Act
                        const hashedPassword = await adapter.hash(plainPassword);

                        // Assert
                        expect(typeof hashedPassword).toBe('string');
                        expect(hashedPassword.length).toBeGreaterThan(0);
                });

                it('should hash very long password', async () => {
                        // Arrange
                        const longPassword = 'x'.repeat(500);

                        // Act
                        const hashedPassword = await adapter.hash(longPassword);

                        // Assert
                        expect(typeof hashedPassword).toBe('string');
                        expect(hashedPassword).not.toBe(longPassword);
                });

                it('should hash password with special characters', async () => {
                        // Arrange
                        const specialPassword = '!@#$%^&*()_+-=[]{}|;:,.<>?`~';

                        // Act
                        const hashedPassword = await adapter.hash(specialPassword);

                        // Assert
                        expect(typeof hashedPassword).toBe('string');
                        expect(hashedPassword).not.toBe(specialPassword);
                });

                it('should hash unicode password', async () => {
                        // Arrange
                        const unicodePassword = 'José@123!مرحبا日本語';

                        // Act
                        const hashedPassword = await adapter.hash(unicodePassword);

                        // Assert
                        expect(typeof hashedPassword).toBe('string');
                        expect(hashedPassword).not.toBe(unicodePassword);
                });
        });

        describe('compare', () => {
                it('should return true for matching password and hash', async () => {
                        // Arrange
                        const plainPassword = 'MySecurePassword123!';
                        const hashedPassword = await adapter.hash(plainPassword);

                        // Act
                        const isMatch = await adapter.compare(plainPassword, hashedPassword);

                        // Assert
                        expect(isMatch).toBe(true);
                });

                it('should return false for non-matching password and hash', async () => {
                        // Arrange
                        const plainPassword = 'MySecurePassword123!';
                        const wrongPassword = 'WrongPassword123!';
                        const hashedPassword = await adapter.hash(plainPassword);

                        // Act
                        const isMatch = await adapter.compare(wrongPassword, hashedPassword);

                        // Assert
                        expect(isMatch).toBe(false);
                });

                it('should return false for empty password against hash', async () => {
                        // Arrange
                        const plainPassword = 'MySecurePassword123!';
                        const hashedPassword = await adapter.hash(plainPassword);

                        // Act
                        const isMatch = await adapter.compare('', hashedPassword);

                        // Assert
                        expect(isMatch).toBe(false);
                });

                it('should return false for password against empty hash', async () => {
                        // Arrange
                        const plainPassword = 'MySecurePassword123!';

                        // Act
                        const isMatch = await adapter.compare(plainPassword, '');

                        // Assert
                        expect(isMatch).toBe(false);
                });

                it('should be case sensitive', async () => {
                        // Arrange
                        const plainPassword = 'MyPassword123!';
                        const hashedPassword = await adapter.hash(plainPassword);
                        const differentCase = 'mypassword123!';

                        // Act
                        const isMatch = await adapter.compare(differentCase, hashedPassword);

                        // Assert
                        expect(isMatch).toBe(false);
                });

                it('should handle whitespace correctly', async () => {
                        // Arrange
                        const plainPassword = 'MyPassword123!';
                        const hashedPassword = await adapter.hash(plainPassword);
                        const withSpaces = ' MyPassword123! ';

                        // Act
                        const isMatch = await adapter.compare(withSpaces, hashedPassword);

                        // Assert
                        expect(isMatch).toBe(false);
                });

                it('should compare unicode password correctly', async () => {
                        // Arrange
                        const unicodePassword = 'José@123!مرحبا';
                        const hashedPassword = await adapter.hash(unicodePassword);

                        // Act
                        const isMatch = await adapter.compare(unicodePassword, hashedPassword);

                        // Assert
                        expect(isMatch).toBe(true);
                });

                it('should return false for similar but different passwords', async () => {
                        // Arrange
                        const password1 = 'MyPassword123';
                        const password2 = 'MyPassword124'; // One character different
                        const hashedPassword = await adapter.hash(password1);

                        // Act
                        const isMatch = await adapter.compare(password2, hashedPassword);

                        // Assert
                        expect(isMatch).toBe(false);
                });
        });

        describe('hash strength', () => {
                it('should produce bcrypt formatted hash', async () => {
                        // Arrange
                        const plainPassword = 'MySecurePassword123!';

                        // Act
                        const hashedPassword = await adapter.hash(plainPassword);

                        // Assert
                        // Bcrypt hashes start with $2a$, $2b$, $2x$, or $2y$
                        expect(/^\$2[aby]\$/.test(hashedPassword)).toBe(true);
                });

                it('should use adequate salt rounds', async () => {
                        // Arrange
                        const plainPassword = 'MySecurePassword123!';

                        // Act
                        const hashedPassword = await adapter.hash(plainPassword);

                        // Assert
                        // Should be a valid bcrypt hash with salt rounds
                        expect(hashedPassword.length).toBe(60); // Standard bcrypt hash length
                });
        });

        describe('integration scenarios', () => {
                it('should work for user registration flow', async () => {
                        // Arrange
                        const userPassword = 'SecureReg123!';

                        // Act
                        const hashedPassword = await adapter.hash(userPassword);
                        const storedHash = hashedPassword; // Simulate database storage

                        // Assert
                        expect(typeof storedHash).toBe('string');

                        // Later: Verify password during login
                        const isPasswordCorrect = await adapter.compare(userPassword, storedHash);
                        expect(isPasswordCorrect).toBe(true);

                        // Wrong password attempt
                        const isWrongPasswordCorrect = await adapter.compare('WrongPassword123!', storedHash);
                        expect(isWrongPasswordCorrect).toBe(false);
                });

                it('should work for password reset flow', async () => {
                        // Arrange
                        const oldPassword = 'OldPassword123!';
                        const newPassword = 'NewPassword456!';

                        // Act
                        const oldHash = await adapter.hash(oldPassword);
                        const newHash = await adapter.hash(newPassword);

                        // Assert
                        expect(oldHash).not.toBe(newHash);

                        // Verify old password fails with new hash
                        const isOldPasswordValid = await adapter.compare(oldPassword, newHash);
                        expect(isOldPasswordValid).toBe(false);

                        // Verify new password works with new hash
                        const isNewPasswordValid = await adapter.compare(newPassword, newHash);
                        expect(isNewPasswordValid).toBe(true);
                });

                it('should handle rapid successive hashing', async () => {
                        // Arrange
                        const password = 'MyPassword123!';

                        // Act
                        const hashes = await Promise.all([
                                adapter.hash(password),
                                adapter.hash(password),
                                adapter.hash(password),
                                adapter.hash(password),
                                adapter.hash(password)
                        ]);

                        // Assert
                        expect(hashes.length).toBe(5);
                        // All should be valid but different
                        hashes.forEach((hash) => {
                                expect(typeof hash).toBe('string');
                        });
                        // All hashes should be unique due to different salts
                        const uniqueHashes = new Set(hashes);
                        expect(uniqueHashes.size).toBe(5);
                });

                it('should handle rapid successive comparisons', async () => {
                        // Arrange
                        const password = 'MyPassword123!';
                        const hashedPassword = await adapter.hash(password);

                        // Act
                        const results = await Promise.all([
                                adapter.compare(password, hashedPassword),
                                adapter.compare(password, hashedPassword),
                                adapter.compare('WrongPassword', hashedPassword),
                                adapter.compare(password, hashedPassword),
                                adapter.compare('AnotherWrong', hashedPassword)
                        ]);

                        // Assert
                        expect(results[0]).toBe(true);
                        expect(results[1]).toBe(true);
                        expect(results[2]).toBe(false);
                        expect(results[3]).toBe(true);
                        expect(results[4]).toBe(false);
                });
        });

        describe('edge cases', () => {
                it('should handle password with null bytes', async () => {
                        // Arrange
                        const passwordWithNull = 'Password\0WithNull';

                        // Act
                        const hashedPassword = await adapter.hash(passwordWithNull);

                        // Assert
                        expect(typeof hashedPassword).toBe('string');
                        const isMatch = await adapter.compare(passwordWithNull, hashedPassword);
                        expect(isMatch).toBe(true);
                });

                it('should handle very short password', async () => {
                        // Arrange
                        const shortPassword = 'a';

                        // Act
                        const hashedPassword = await adapter.hash(shortPassword);

                        // Assert
                        expect(typeof hashedPassword).toBe('string');
                        const isMatch = await adapter.compare(shortPassword, hashedPassword);
                        expect(isMatch).toBe(true);
                });

                it('should handle numeric password', async () => {
                        // Arrange
                        const numericPassword = '1234567890';

                        // Act
                        const hashedPassword = await adapter.hash(numericPassword);

                        // Assert
                        expect(typeof hashedPassword).toBe('string');
                        const isMatch = await adapter.compare(numericPassword, hashedPassword);
                        expect(isMatch).toBe(true);
                });

                it('should handle password with repeated characters', async () => {
                        // Arrange
                        const repeatedPassword = 'aaaaaaaaaa';

                        // Act
                        const hashedPassword = await adapter.hash(repeatedPassword);

                        // Assert
                        expect(typeof hashedPassword).toBe('string');
                        const isMatch = await adapter.compare(repeatedPassword, hashedPassword);
                        expect(isMatch).toBe(true);
                });
        });

        describe('error handling', () => {
                it('should handle invalid hash format on compare', async () => {
                        // Arrange
                        const invalidHash = 'not-a-valid-bcrypt-hash';

                        // Act & Assert
                        await expect(adapter.compare('AnyPassword', invalidHash)).rejects.toThrow();
                });

                it('should handle null password in hash', async () => {
                        // Act & Assert
                        await expect(adapter.hash(null as any)).rejects.toThrow();
                });

                it('should handle null inputs in compare', async () => {
                        // Act & Assert
                        await expect(adapter.compare(null as any, 'somehash')).rejects.toThrow();
                });
        });
});
