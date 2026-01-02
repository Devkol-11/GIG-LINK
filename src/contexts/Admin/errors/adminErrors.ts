import { BusinessError } from '@src/shared/errors/BusinessError.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';

export class adminAlreadyExists extends BusinessError {
        public readonly statusCode: number = httpStatus.BadRequest;

        constructor(message = 'admin already exists') {
                super(message, httpStatus.BadRequest);
                Object.setPrototypeOf(this, BusinessError);
        }
}

export class adminNotFound extends BusinessError {
        public readonly statusCode: number = httpStatus.NotFound;

        constructor(message = 'admin not found') {
                super(message, httpStatus.NotFound);
                Object.setPrototypeOf(this, BusinessError);
        }
}

export class invalidAdminPassword extends BusinessError {
        public readonly statusCode: number = httpStatus.BadRequest;

        constructor(message = 'invalid password') {
                super(message, httpStatus.BadRequest);
                Object.setPrototypeOf(this, BusinessError);
        }
}
