'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.registerUseCase = exports.RegisterUseCase = void 0;
const User_1 = require('../../domain/entities/User');
const DomainException_1 = require('../../domain/exceptions/DomainException');
const UserRegisteredEvent_1 = require('../../domain/events/UserRegisteredEvent');
//IMPORT IMPLEMENTATIONS
const AuthService_1 = require('../../domain/services/AuthService');
const AuthRepository_1 = require('../../infrastructure/AuthRepository');
const RabbitMQService_1 = require('../../infrastructure/RabbitMQService');
class RegisterUseCase {
        constructor(authservice, authRepository, eventPublisher) {
                this.authservice = authservice;
                this.authRepository = authRepository;
                this.eventPublisher = eventPublisher;
        }
        async Execute(DTO) {
                const { email, password, firstName, lastName, phoneNumber } =
                        DTO;
                if (await this.authRepository.findByEmail(email)) {
                        throw new DomainException_1.DomainException(
                                `User : ${email} Already Exists`,
                                404
                        );
                }
                const hashedPassword =
                        await this.authservice.hashPassword(password);
                const user = User_1.User.create({
                        email: email,
                        password: hashedPassword,
                        firstName: firstName,
                        lastName: lastName,
                        phoneNumber: phoneNumber
                });
                const newUser = await this.authRepository.create(user);
                const accessToken = this.authservice.generateAccessToken(
                        newUser.id,
                        newUser.id
                );
                const userRegisteredEvent =
                        new UserRegisteredEvent_1.UserRegisteredEvent(
                                newUser.id,
                                newUser.email,
                                newUser.firstName,
                                newUser.lastName
                        );
                await this.eventPublisher.publish(
                        userRegisteredEvent.routing_key,
                        userRegisteredEvent
                );
                return {
                        message: 'Registration Successful , Welcome !',
                        user: {
                                id: newUser.id,
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                isEmailVerified: user.isEmailVerified
                        },
                        token: {
                                accessToken
                        }
                };
        }
}
exports.RegisterUseCase = RegisterUseCase;
exports.registerUseCase = new RegisterUseCase(
        AuthService_1.authservice,
        AuthRepository_1.authRepository,
        RabbitMQService_1.rabbitMQEventPublisher
);
