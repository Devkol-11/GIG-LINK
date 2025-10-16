"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = exports.RegisterController = void 0;
const ResponseHelpers_1 = require("../../../../shared/helpers/ResponseHelpers");
const httpStatusCode_1 = require("../../../../shared/constants/httpStatusCode");
//IMPORT IMPLEMENTATION
const RegisterUseCase_1 = require("../../application/useCases/RegisterUseCase");
class RegisterController {
    constructor(registerUseCase) {
        this.registerUseCase = registerUseCase;
    }
    async Execute(req, res, next) {
        try {
            const { email, password, phoneNumber, firstName, lastName } = req.body;
            const response = await this.registerUseCase.Execute({
                email,
                password,
                phoneNumber,
                firstName,
                lastName,
            });
            (0, ResponseHelpers_1.sendResponse)(res, httpStatusCode_1.httpStatus.Success, response);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.RegisterController = RegisterController;
exports.registerController = new RegisterController(RegisterUseCase_1.registerUseCase);
