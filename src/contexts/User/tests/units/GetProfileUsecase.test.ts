import { GetProfileUsecase } from '../../application/useCases/getProfileUsecase.js';
import { UserNotFoundError } from '../../domain/errors/DomainErrors.js';

jest.mock('../../adapters/ProfileRepository.js');

describe('GetProfileUsecase - UNIT TESTS', () => {
        let usecase: GetProfileUsecase;
        let mockProfileRepository: any;

        beforeEach(() => {
                jest.clearAllMocks();

                mockProfileRepository = {
                        findUserById: jest.fn(),
                        findById: jest.fn()
                };

                usecase = new GetProfileUsecase(mockProfileRepository);
        });

        describe('execute', () => {
                it('should retrieve profile by user id', async () => {
                        // Arrange
                        const userId = 'user-123';
                        const mockProfile = {
                                id: 'profile-123',
                                userId: userId,
                                bio: 'Professional developer',
                                skills: ['TypeScript', 'Node.js']
                        };

                        mockProfileRepository.findUserById.mockResolvedValue(mockProfile);

                        // Act
                        const result = await usecase.execute(userId);

                        // Assert
                        expect(mockProfileRepository.findUserById).toHaveBeenCalledWith(userId);
                        expect(result).toEqual(mockProfile);
                });

                it('should return null if profile does not exist', async () => {
                        // Arrange
                        const userId = 'non-existent';
                        mockProfileRepository.findUserById.mockResolvedValue(null);

                        // Act
                        const result = await usecase.execute(userId);

                        // Assert
                        expect(result).toBeNull();
                });

                it('should return profile with complete details', async () => {
                        // Arrange
                        const userId = 'user-123';
                        const mockProfile = {
                                id: 'profile-123',
                                userId: userId,
                                bio: 'Professional developer',
                                skills: ['TypeScript', 'Node.js'],
                                experience: '5 years',
                                portfolio: 'https://portfolio.com',
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockProfileRepository.findUserById.mockResolvedValue(mockProfile);

                        // Act
                        const result = await usecase.execute(userId);

                        // Assert
                        expect(result).toEqual(mockProfile);
                        expect(result.bio).toBe(mockProfile.bio);
                        expect(result.skills).toEqual(mockProfile.skills);
                });

                it('should handle database errors', async () => {
                        // Arrange
                        const userId = 'user-123';
                        mockProfileRepository.findUserById.mockRejectedValue(new Error('Database error'));

                        // Act & Assert
                        await expect(usecase.execute(userId)).rejects.toThrow('Database error');
                });

                it('should retrieve profile by profile id', async () => {
                        // Arrange
                        const profileId = 'profile-123';
                        const mockProfile = {
                                id: profileId,
                                userId: 'user-123',
                                bio: 'Professional developer'
                        };

                        mockProfileRepository.findById.mockResolvedValue(mockProfile);

                        // Act
                        const result = await usecase.findById(profileId);

                        // Assert
                        expect(result).toEqual(mockProfile);
                });

                it('should return null if profile by id does not exist', async () => {
                        // Arrange
                        const profileId = 'non-existent-profile';
                        mockProfileRepository.findById.mockResolvedValue(null);

                        // Act
                        const result = await usecase.findById(profileId);

                        // Assert
                        expect(result).toBeNull();
                });
        });
});
