"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = exports.LoginController = void 0;
const ResponseHelpers_1 = require("@src/shared/helpers/ResponseHelpers");
const httpStatusCode_1 = require("@src/shared/constants/httpStatusCode");
//import implementation
const LoginUseCase_1 = require("../../application/useCases/LoginUseCase");
const winston_1 = require("@core/logging/winston");
class LoginController {
    constructor(loginUseCase) {
        this.loginUseCase = loginUseCase;
    }
    async Execute(req, res, next) {
        winston_1.logger.info("[Controller] Register called", { body: req.body });
        try {
            const { email, password } = req.body;
            const response = this.loginUseCase.Execute({ email, password });
            (0, ResponseHelpers_1.sendResponse)(res, httpStatusCode_1.httpStatus.Success, response);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.LoginController = LoginController;
exports.loginController = new LoginController(LoginUseCase_1.loginUseCase);
