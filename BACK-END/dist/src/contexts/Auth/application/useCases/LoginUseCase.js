"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUseCase = exports.LoginUseCase = void 0;
const DomainException_1 = require("../../domain/exceptions/DomainException");
//IMPORT IMPLEMENTATIONS
const AuthService_1 = require("../../domain/services/AuthService");
const AuthRepository_1 = require("../../infrastructure/AuthRepository");
const RabbitMQService_1 = require("../../infrastructure/RabbitMQService");
class LoginUseCase {
    constructor(authService, authRepository, eventPublisher) {
        this.authService = authService;
        this.authRepository = authRepository;
        this.eventPublisher = eventPublisher;
    }
    async Execute(DTO) {
        const { email, password } = DTO;
        const user = await this.authRepository.findByEmail(email);
        if (!user) {
            throw new DomainException_1.DomainException(`could not find user with email : ${email}`, 404);
        }
        const comparePassword = await this.authService.comparePassword(password, user.password);
        if (!comparePassword) {
            throw new DomainException_1.DomainException("invalid Password", 404);
        }
        const accessToken = this.authService.generateAccessToken(user.id, user.email);
        return {
            message: "Login successful , Welcome back !",
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isEmailVerified: user.isEmailVerified,
            },
            token: {
                accessToken,
            },
        };
    }
}
exports.LoginUseCase = LoginUseCase;
exports.loginUseCase = new LoginUseCase(AuthService_1.authservice, AuthRepository_1.authRepository, RabbitMQService_1.rabbitMQEventPublisher);
