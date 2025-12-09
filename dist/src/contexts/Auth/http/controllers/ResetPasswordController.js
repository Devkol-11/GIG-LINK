'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.resetPasswordController = exports.ResetPasswordController = void 0;
const ResponseHelpers_1 = require('@src/shared/helpers/ResponseHelpers');
const httpStatusCode_1 = require('@src/shared/constants/httpStatusCode');
//IMPORT IMPLEMENTATIONS
const ResetPasswordUseCase_1 = require('../../application/useCases/ResetPasswordUseCase');
class ResetPasswordController {
        constructor(resetPasswordUseCase) {
                this.resetPasswordUseCase = resetPasswordUseCase;
        }
        async Execute(req, res, next) {
                try {
                        const { token, password } = req.body;
                        const response =
                                await this.resetPasswordUseCase.Execute(
                                        token,
                                        password
                                );
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
exports.ResetPasswordController = ResetPasswordController;
exports.resetPasswordController = new ResetPasswordController(
        ResetPasswordUseCase_1.resetPasswordUseCase
);
