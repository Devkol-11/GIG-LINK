import { IUserRepository } from '../../ports/IUserRepository.js';
import { UserNotFoundError } from '../../domain/errors/DomainErrors.js';
import { userRepository } from '../../adapters/UserRepository.js';
import { logger } from '@core/Winston/winston.js';

export class LogOutUseCase {
        constructor(private readonly userRepository: IUserRepository) {}

        async execute(userId: string) {
                const user = await this.userRepository.findById(userId);

                if (!user) throw new UserNotFoundError();

                await this.userRepository.invalidateRefreshToken(userId);

                logger.info(`User ${userId} has been logged out successfully`);

                return {
                        message: 'Logout successful'
                };
        }
}

export const logOutUseCase = new LogOutUseCase(userRepository);
