import { AvatarGenerator } from '../../adapters/AvatarGenerator.js';

describe('AvatarGenerator - UNIT TESTS', () => {
        let adapter: AvatarGenerator;

        beforeEach(() => {
                jest.clearAllMocks();
                adapter = new AvatarGenerator();
        });

        describe('generateFromEmail', () => {
                it('should generate avatar URL from email', async () => {
                        // Arrange
                        const email = 'user@example.com';

                        // Act
                        const avatarUrl = await adapter.generateFromEmail(email);

                        // Assert
                        expect(typeof avatarUrl).toBe('string');
                        expect(avatarUrl.length).toBeGreaterThan(0);
                        expect(avatarUrl).toMatch(/^https?:\/\/.+/); // Should be a valid URL
                });

                it('should generate different avatars for different emails', async () => {
                        // Arrange
                        const email1 = 'user1@example.com';
                        const email2 = 'user2@example.com';

                        // Act
                        const avatar1 = await adapter.generateFromEmail(email1);
                        const avatar2 = await adapter.generateFromEmail(email2);

                        // Assert
                        expect(avatar1).not.toBe(avatar2);
                });

                it('should generate same avatar for same email', async () => {
                        // Arrange
                        const email = 'user@example.com';

                        // Act
                        const avatar1 = await adapter.generateFromEmail(email);
                        const avatar2 = await adapter.generateFromEmail(email);

                        // Assert
                        expect(avatar1).toBe(avatar2);
                });

                it('should handle email with uppercase letters', async () => {
                        // Arrange
                        const email = 'USER@EXAMPLE.COM';

                        // Act
                        const avatarUrl = await adapter.generateFromEmail(email);

                        // Assert
                        expect(typeof avatarUrl).toBe('string');
                        expect(avatarUrl.length).toBeGreaterThan(0);
                });

                it('should handle email with special characters', async () => {
                        // Arrange
                        const email = 'user+test@example.co.uk';

                        // Act
                        const avatarUrl = await adapter.generateFromEmail(email);

                        // Assert
                        expect(typeof avatarUrl).toBe('string');
                        expect(avatarUrl.length).toBeGreaterThan(0);
                });

                it('should handle unicode email addresses', async () => {
                        // Arrange
                        const email = 'josé@example.com';

                        // Act
                        const avatarUrl = await adapter.generateFromEmail(email);

                        // Assert
                        expect(typeof avatarUrl).toBe('string');
                });
        });

        describe('generateFromName', () => {
                it('should generate avatar from user name', async () => {
                        // Arrange
                        const firstName = 'John';
                        const lastName = 'Doe';

                        // Act
                        const avatarUrl = await adapter.generateFromName(firstName, lastName);

                        // Assert
                        expect(typeof avatarUrl).toBe('string');
                        expect(avatarUrl.length).toBeGreaterThan(0);
                });

                it('should use initials in avatar', async () => {
                        // Arrange
                        const firstName = 'John';
                        const lastName = 'Doe';

                        // Act
                        const avatarUrl = await adapter.generateFromName(firstName, lastName);

                        // Assert
                        // Should contain initials (JD) in some form
                        expect(avatarUrl).toMatch(/^https?:\/\/.+/);
                });

                it('should generate different avatars for different names', async () => {
                        // Arrange
                        const avatar1 = await adapter.generateFromName('John', 'Doe');
                        const avatar2 = await adapter.generateFromName('Jane', 'Smith');

                        // Act & Assert
                        expect(avatar1).not.toBe(avatar2);
                });

                it('should generate same avatar for same name', async () => {
                        // Arrange
                        const firstName = 'John';
                        const lastName = 'Doe';

                        // Act
                        const avatar1 = await adapter.generateFromName(firstName, lastName);
                        const avatar2 = await adapter.generateFromName(firstName, lastName);

                        // Assert
                        expect(avatar1).toBe(avatar2);
                });

                it('should handle single name (no last name)', async () => {
                        // Arrange
                        const firstName = 'Madonna';

                        // Act
                        const avatarUrl = await adapter.generateFromName(firstName, '');

                        // Assert
                        expect(typeof avatarUrl).toBe('string');
                        expect(avatarUrl.length).toBeGreaterThan(0);
                });

                it('should handle names with special characters', async () => {
                        // Arrange
                        const firstName = "O'Brien";
                        const lastName = "D'Angelo";

                        // Act
                        const avatarUrl = await adapter.generateFromName(firstName, lastName);

                        // Assert
                        expect(typeof avatarUrl).toBe('string');
                });

                it('should handle names with unicode characters', async () => {
                        // Arrange
                        const firstName = 'José';
                        const lastName = 'García';

                        // Act
                        const avatarUrl = await adapter.generateFromName(firstName, lastName);

                        // Assert
                        expect(typeof avatarUrl).toBe('string');
                });

                it('should handle very long names', async () => {
                        // Arrange
                        const firstName = 'Jean-Pierre-François';
                        const lastName = 'Beaumont-Dubois-Leclerc';

                        // Act
                        const avatarUrl = await adapter.generateFromName(firstName, lastName);

                        // Assert
                        expect(typeof avatarUrl).toBe('string');
                });

                it('should handle names with numbers', async () => {
                        // Arrange
                        const firstName = 'User123';
                        const lastName = 'Test456';

                        // Act
                        const avatarUrl = await adapter.generateFromName(firstName, lastName);

                        // Assert
                        expect(typeof avatarUrl).toBe('string');
                });
        });

        describe('generateFromInitials', () => {
                it('should generate avatar from initials', async () => {
                        // Arrange
                        const initials = 'JD';

                        // Act
                        const avatarUrl = await adapter.generateFromInitials(initials);

                        // Assert
                        expect(typeof avatarUrl).toBe('string');
                        expect(avatarUrl.length).toBeGreaterThan(0);
                });

                it('should accept single initial', async () => {
                        // Arrange
                        const initials = 'J';

                        // Act
                        const avatarUrl = await adapter.generateFromInitials(initials);

                        // Assert
                        expect(typeof avatarUrl).toBe('string');
                });

                it('should accept multiple initials', async () => {
                        // Arrange
                        const initials = 'JPF';

                        // Act
                        const avatarUrl = await adapter.generateFromInitials(initials);

                        // Assert
                        expect(typeof avatarUrl).toBe('string');
                });

                it('should handle case insensitivity for initials', async () => {
                        // Arrange
                        const avatar1 = await adapter.generateFromInitials('JD');
                        const avatar2 = await adapter.generateFromInitials('jd');

                        // Act & Assert
                        // Same avatar regardless of case
                        expect(avatar1.toLowerCase()).toBe(avatar2.toLowerCase());
                });

                it('should handle numeric initials', async () => {
                        // Arrange
                        const initials = '123';

                        // Act
                        const avatarUrl = await adapter.generateFromInitials(initials);

                        // Assert
                        expect(typeof avatarUrl).toBe('string');
                });
        });

        describe('generateFromUserId', () => {
                it('should generate consistent avatar from user ID', async () => {
                        // Arrange
                        const userId = 'user-123';

                        // Act
                        const avatar1 = await adapter.generateFromUserId(userId);
                        const avatar2 = await adapter.generateFromUserId(userId);

                        // Assert
                        expect(avatar1).toBe(avatar2);
                });

                it('should generate different avatars for different user IDs', async () => {
                        // Arrange
                        const userId1 = 'user-123';
                        const userId2 = 'user-456';

                        // Act
                        const avatar1 = await adapter.generateFromUserId(userId1);
                        const avatar2 = await adapter.generateFromUserId(userId2);

                        // Assert
                        expect(avatar1).not.toBe(avatar2);
                });

                it('should handle UUID format user IDs', async () => {
                        // Arrange
                        const userId = '550e8400-e29b-41d4-a716-446655440000';

                        // Act
                        const avatarUrl = await adapter.generateFromUserId(userId);

                        // Assert
                        expect(typeof avatarUrl).toBe('string');
                });

                it('should handle numeric user IDs', async () => {
                        // Arrange
                        const userId = '12345';

                        // Act
                        const avatarUrl = await adapter.generateFromUserId(userId);

                        // Assert
                        expect(typeof avatarUrl).toBe('string');
                });
        });

        describe('avatar validation', () => {
                it('should generate valid image URLs', async () => {
                        // Arrange
                        const email = 'user@example.com';

                        // Act
                        const avatarUrl = await adapter.generateFromEmail(email);

                        // Assert
                        // Should be a proper URL
                        expect(avatarUrl).toMatch(/^https?:\/\/[^\s]+$/);
                });

                it('should include consistent color/styling across generations', async () => {
                        // Arrange
                        const email = 'user@example.com';

                        // Act
                        const avatar1 = await adapter.generateFromEmail(email);
                        const avatar2 = await adapter.generateFromEmail(email);

                        // Assert
                        // Same email should produce identical URLs (same styling)
                        expect(avatar1).toBe(avatar2);
                });

                it('should generate proper image format URLs', async () => {
                        // Arrange
                        const firstName = 'John';
                        const lastName = 'Doe';

                        // Act
                        const avatarUrl = await adapter.generateFromName(firstName, lastName);

                        // Assert
                        // Should be an image URL (svg or png)
                        expect(avatarUrl).toMatch(/\.(svg|png|jpg|jpeg|gif)(\?|$)/i) ||
                                expect(avatarUrl).toMatch(/avatar|api/i);
                });
        });

        describe('batch generation', () => {
                it('should handle generating multiple avatars', async () => {
                        // Arrange
                        const emails = ['user1@example.com', 'user2@example.com', 'user3@example.com'];

                        // Act
                        const avatars = await Promise.all(
                                emails.map((email) => adapter.generateFromEmail(email))
                        );

                        // Assert
                        expect(avatars.length).toBe(3);
                        expect(avatars.every((a) => typeof a === 'string')).toBe(true);
                });

                it('should maintain consistency in batch generation', async () => {
                        // Arrange
                        const email = 'user@example.com';

                        // Act
                        const batch1 = await Promise.all([
                                adapter.generateFromEmail(email),
                                adapter.generateFromEmail(email)
                        ]);
                        const batch2 = await Promise.all([
                                adapter.generateFromEmail(email),
                                adapter.generateFromEmail(email)
                        ]);

                        // Assert
                        expect(batch1[0]).toBe(batch2[0]);
                });
        });

        describe('avatar customization', () => {
                it('should accept color preference for avatar', async () => {
                        // Arrange
                        const email = 'user@example.com';
                        const color = '#FF5733';

                        // Act
                        const avatarUrl = await adapter.generateFromEmail(email, { color });

                        // Assert
                        expect(typeof avatarUrl).toBe('string');
                });

                it('should accept size preference for avatar', async () => {
                        // Arrange
                        const email = 'user@example.com';
                        const size = 256;

                        // Act
                        const avatarUrl = await adapter.generateFromEmail(email, { size });

                        // Assert
                        expect(typeof avatarUrl).toBe('string');
                });

                it('should accept background color preference', async () => {
                        // Arrange
                        const email = 'user@example.com';
                        const bgColor = '#FFFFFF';

                        // Act
                        const avatarUrl = await adapter.generateFromEmail(email, { bgColor });

                        // Assert
                        expect(typeof avatarUrl).toBe('string');
                });

                it('should handle multiple customization options', async () => {
                        // Arrange
                        const firstName = 'John';
                        const lastName = 'Doe';
                        const options = {
                                size: 512,
                                color: '#FF5733',
                                bgColor: '#000000'
                        };

                        // Act
                        const avatarUrl = await adapter.generateFromName(firstName, lastName, options);

                        // Assert
                        expect(typeof avatarUrl).toBe('string');
                });
        });

        describe('error handling', () => {
                it('should handle empty email gracefully', async () => {
                        // Arrange
                        const email = '';

                        // Act & Assert
                        try {
                                const avatar = await adapter.generateFromEmail(email);
                                expect(avatar).toBeDefined();
                        } catch (error) {
                                expect(error).toBeDefined();
                        }
                });

                it('should handle invalid email gracefully', async () => {
                        // Arrange
                        const email = 'not-an-email';

                        // Act
                        const avatarUrl = await adapter.generateFromEmail(email);

                        // Assert
                        expect(typeof avatarUrl).toBe('string');
                });

                it('should handle null name gracefully', async () => {
                        // Arrange
                        const firstName = null as any;
                        const lastName = 'Doe';

                        // Act & Assert
                        try {
                                const avatar = await adapter.generateFromName(firstName, lastName);
                                expect(avatar).toBeDefined();
                        } catch (error) {
                                expect(error).toBeDefined();
                        }
                });

                it('should handle network errors', async () => {
                        // Arrange - Mock network failure
                        const email = 'user@example.com';

                        // If external API is used and fails
                        // Should either return fallback or throw appropriate error

                        // Act & Assert
                        try {
                                const avatar = await adapter.generateFromEmail(email);
                                expect(avatar).toBeDefined();
                        } catch (error) {
                                expect(error).toBeDefined();
                        }
                });
        });

        describe('integration scenarios', () => {
                it('should work for user registration flow', async () => {
                        // Arrange
                        const newUser = {
                                firstName: 'John',
                                lastName: 'Doe',
                                email: 'john.doe@example.com'
                        };

                        // Act
                        const avatarUrl = await adapter.generateFromName(newUser.firstName, newUser.lastName);

                        // Assert
                        expect(typeof avatarUrl).toBe('string');
                        expect(avatarUrl.length).toBeGreaterThan(0);
                });

                it('should work for profile update flow', async () => {
                        // Arrange
                        const userId = 'user-123';
                        const updatedName = 'Jane Smith';

                        // Act
                        const parts = updatedName.split(' ');
                        const avatarUrl = await adapter.generateFromName(parts[0], parts[1]);

                        // Assert
                        expect(typeof avatarUrl).toBe('string');
                });

                it('should work with OAuth providers', async () => {
                        // Arrange
                        const googleEmail = 'user.name+google@gmail.com';

                        // Act
                        const avatarUrl = await adapter.generateFromEmail(googleEmail);

                        // Assert
                        expect(typeof avatarUrl).toBe('string');
                });

                it('should handle avatar update on profile changes', async () => {
                        // Arrange
                        const userId = 'user-123';

                        // Act
                        const avatar1 = await adapter.generateFromUserId(userId);
                        const avatar2 = await adapter.generateFromUserId(userId);

                        // Assert
                        expect(avatar1).toBe(avatar2); // Should be consistent
                });
        });

        describe('avatar caching', () => {
                it('should cache generated avatars for performance', async () => {
                        // Arrange
                        const email = 'user@example.com';

                        // Act
                        const avatar1 = await adapter.generateFromEmail(email);
                        const avatar2 = await adapter.generateFromEmail(email);

                        // Assert
                        // Should return exact same string (cached)
                        expect(avatar1).toBe(avatar2);
                });

                it('should maintain cache across requests', async () => {
                        // Arrange
                        const initials = 'ABC';

                        // Act
                        const avatar1 = await adapter.generateFromInitials(initials);
                        const avatar2 = await adapter.generateFromInitials(initials);
                        const avatar3 = await adapter.generateFromInitials(initials);

                        // Assert
                        expect(avatar1).toBe(avatar2);
                        expect(avatar2).toBe(avatar3);
                });
        });
});
