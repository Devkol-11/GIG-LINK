'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.validateRequest = void 0;
const validateRequest = (schema) => {
        return (req, res, next) => {
                const { error } = schema.validate(req.body, {
                        abortEarly: false
                });
                if (error) {
                        const details = error.details.map((d) => d.message);
                        return res.status(400).json({
                                status: 'error',
                                message: 'Validation failed',
                                errors: details
                        });
                }
                next();
        };
};
exports.validateRequest = validateRequest;
