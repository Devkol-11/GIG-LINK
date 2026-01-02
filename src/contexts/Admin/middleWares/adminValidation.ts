import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { AdminRole } from '../enums/enums.js';
import { UnAuthorizedAccessError } from '@src/contexts/User/domain/errors/DomainErrors.js';

export class AdminValidation {
        // Admin Registration Validation Schema
        registerSchema = Joi.object({
                firstName: Joi.string().min(2).max(50).required().messages({
                        'string.min': 'First name must be at least 2 characters long.',
                        'string.max': 'First name must not exceed 50 characters.',
                        'any.required': 'First name is required.'
                }),

                lastName: Joi.string().min(2).max(50).required().messages({
                        'string.min': 'Last name must be at least 2 characters long.',
                        'string.max': 'Last name must not exceed 50 characters.',
                        'any.required': 'Last name is required.'
                }),

                email: Joi.string()
                        .email({ tlds: { allow: false } })
                        .required()
                        .messages({
                                'string.email': 'Email must be a valid email address.',
                                'any.required': 'Email is required.'
                        }),

                password: Joi.string()
                        .pattern(
                                new RegExp(
                                        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
                                )
                        )
                        .required()
                        .messages({
                                'string.pattern.base':
                                        'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.',
                                'any.required': 'Password is required.'
                        })
        });

        // Admin Login Validation Schema
        loginSchema = Joi.object({
                email: Joi.string()
                        .email({ tlds: { allow: false } })
                        .required()
                        .messages({
                                'string.email': 'Email must be a valid email address.',
                                'any.required': 'Email is required.'
                        }),

                password: Joi.string().required().messages({
                        'any.required': 'Password is required.'
                })
        });

        /**
         * Middleware to validate request body against a Joi schema
         * @param schema - Joi schema to validate against
         * @returns Express middleware function
         */
        validateRequest = (schema: Joi.ObjectSchema) => {
                return (req: Request, res: Response, next: NextFunction) => {
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

        logoutSchema = Joi.object({
                refreshToken: Joi.string().required().messages({
                        'any.required': 'Refresh token is required.'
                })
        });

        /**
         * Middleware to authorize admin users
         * Checks if the authenticated user has admin role
         * @returns Express middleware function
         */
        authorizeAdmin = () => {
                return (req: Request, res: Response, next: NextFunction) => {
                        if (!req.user) {
                                throw new UnAuthorizedAccessError('Not authenticated. Please login.');
                        }

                        // Check if user role is SUPER_ADMIN
                        if (req.user.role !== AdminRole) {
                                throw new UnAuthorizedAccessError(
                                        'Access denied. Admin privileges required.'
                                );
                        }

                        next();
                };
        };
}

export const adminValidation = new AdminValidation();
