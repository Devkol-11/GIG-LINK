import { IUserRepository } from '../../ports/IUserRepository.js';
import { IOtpRepository } from '../../ports/IOtpRepository.js';
import {
        InvalidTokenError,
        TokenNotFoundError,
        UserNotFoundError
} from '../../domain/errors/DomainErrors.js';
import { UserService, userService } from '../../domain/services/UserService.js';
import { userRepository } from '../../adapters/UserRepository.js';
import { otpRepository } from '../../adapters/OtpRepository.js';
import { UnitOfWork, unitOfWork } from '../../adapters/UnitOfWork.js';

export class ResetPasswordUseCase {
        constructor(
                private userRepository: IUserRepository,
                private authService: UserService,
                private otpRepository: IOtpRepository,
                private unitOfWork: UnitOfWork
        ) {}

        async execute(otp: string, newPassword: string) {
                const tokenData = await this.otpRepository.findByToken(otp);

                if (tokenData === null) throw new TokenNotFoundError();

                if (tokenData.token !== otp) {
                        throw new InvalidTokenError();
                }

                const currentDate = new Date();

                if (currentDate > tokenData.expiresAt) throw new InvalidTokenError('OTP expired');

                const passwordHash = await this.authService.hashPassword(newPassword);

                const user = await this.userRepository.findById(tokenData.userId);
                if (!user) throw new UserNotFoundError();

                user.changePassword(passwordHash);

                await this.unitOfWork.transaction(async (trx) => {
                        await this.userRepository.save(user);
                        await this.otpRepository.deleteAllForUser(tokenData.userId, trx);
                });

                return {
                        message: 'Password reset Successful'
                };
        }
}

export const resetPasswordUseCase = new ResetPasswordUseCase(
        userRepository,
        userService,
        otpRepository,
        unitOfWork
);
