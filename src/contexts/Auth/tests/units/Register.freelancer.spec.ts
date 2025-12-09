import { mock } from 'jest-mock-extended';
import { RegisterFreeLancerUseCase } from '../../application/useCases/RegisterFreeLancerUseCase.js';
import { UserConflict } from '../../domain/errors/DomainErrors.js';
import { AuthService } from '../../domain/services/AuthService.js';
import { IAuthRepository } from '../../ports/AuthRepository.js';
import { UnitOfWork } from '../../adapters/UnitOfWork.js';
import { IEventBus } from '@core/message-brokers/ports/IEventBus.js';
import { ROLE } from '../../../../../prisma/generated/prisma/enums.js';

describe('RegisterFreeLancerUseCase - Unit', () => {
        let mockAuthService: jest.Mocked<AuthService>;
        let mockAuthRepository: jest.Mocked<IAuthRepository>;
        let mockUnitOfWork: jest.Mocked<UnitOfWork>;
        let mockEventBus: jest.Mocked<IEventBus>;

        let usecase: RegisterFreeLancerUseCase;

        beforeEach(() => {
                mockAuthService = mock<AuthService>();
                mockAuthRepository = mock<IAuthRepository>();
                mockUnitOfWork = mock<UnitOfWork>();
                mockEventBus = mock<IEventBus>();

                usecase = new RegisterFreeLancerUseCase(
                        mockAuthService,
                        mockAuthRepository,
                        mockUnitOfWork,
                        mockEventBus
                );
        });

        it('should throw UserConflict if email already exists', async () => {
                // Arrange — the repository returns an existing user
                const fakeUser = {
                        id: 'u1',
                        googleId: null,
                        email: 'test@gmail.com',
                        passwordHash: 'hashed',
                        firstName: 'John',
                        lastName: 'Doe',
                        phoneNumber: '12345',
                        isEmailVerified: false,
                        role: ROLE.FREELANCER,
                        refreshToken: null,
                        createdAt: new Date(),
                        updatedAt: new Date()
                };

                mockAuthRepository.findByEmail.mockResolvedValue(fakeUser);

                // Act + Assert — expect the usecase to throw UserConflict
                await expect(
                        usecase.Execute({
                                email: 'test@mail.com',
                                password: '123456',
                                firstName: 'John',
                                lastName: 'Doe',
                                phoneNumber: '0700000000'
                        })
                ).rejects.toThrow(UserConflict);

                // Extra: ensure no further methods were called
                expect(mockAuthService.hashPassword).not.toHaveBeenCalled();
                expect(mockUnitOfWork.transaction).not.toHaveBeenCalled();
                expect(mockEventBus.publish).not.toHaveBeenCalled();
        });
});
