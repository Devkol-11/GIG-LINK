'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.forgotPasswordController = exports.ForgotPasswordController = void 0;
const ResponseHelpers_1 = require('@src/shared/helpers/ResponseHelpers');
const httpStatusCode_1 = require('@src/shared/constants/httpStatusCode');
// IMPORT IMPLEMENTATIONS
const ForgotPasswordUseCase_1 = require('../../application/useCases/ForgotPasswordUseCase');
class ForgotPasswordController {
        constructor(forgotPasswordUseCase) {
                this.forgotPasswordUseCase = forgotPasswordUseCase;
        }
        async Execute(req, res, next) {
                try {
                        const { email } = req.body;
                        const response =
                                this.forgotPasswordUseCase.Execute(email);
                        (0, ResponseHelpers_1.sendResponse)(
                                res,
                                httpStatusCode_1.httpStatus.Success,
                                response
                        );
                } catch (error) {
                        next(error);
                }
        }
}
exports.ForgotPasswordController = ForgotPasswordController;
exports.forgotPasswordController = new ForgotPasswordController(
        ForgotPasswordUseCase_1.forgotPasswordUseCase
);
