export const httpStatus = Object.freeze({
        Continue: 100,

        Success: 200, // Standard response for successful HTTP requests (GET)
        Created: 201, // Resource successfully created (POST)
        Accepted: 202, // Request accepted for processing, but processing is not yet complete (Async tasks)
        NoContent: 204, // Request successful, but no content to return (PUT/DELETE/POST where no body is needed)

        MultipleChoices: 300,
        Found: 302,
        NotModified: 304,

        BadRequest: 400, // Malformed request syntax, invalid parameters, or failed validation
        Unauthorized: 401, // Authentication failed (client must authenticate to gain access)
        PaymentRequired: 402, // Reserved for future use (or actual payment gateway requirements)
        Forbidden: 403, // Authentication succeeded, but the user does not have permission (Authorization failure)
        NotFound: 404, // Resource not found (the requested URI doesn't exist)
        MethodNotAllowed: 405, // HTTP method used is not supported for the requested resource (e.g., POST on a read-only endpoint)
        NotAcceptable: 406, // The server cannot produce a response that matches the list of acceptable values defined in the request's headers
        Conflict: 409, // The request could not be completed because of a conflict (e.g., unique constraint violation, concurrent update)
        Gone: 410, // Resource is permanently gone (better than 404 if you know it won't return)
        UnsupportedMedia: 415,
        UnprocessableEntity: 422, // Semantic errors (the request is valid but the data itself is logically unsound/violates business rules)
        TooManyRequests: 429, // Rate limiting applied (user has sent too many requests in a given time frame)

        InternalServerError: 500, // Generic error when an unexpected condition was encountered
        NotImplemented: 501, // The server does not support the functionality required to fulfill the request
        BadGateway: 502, // The server, while acting as a gateway or proxy, received an invalid response from an upstream server
        ServiceUnavailable: 503, // The server is currently unable to handle the request due to temporary overloading or maintenance
        GatewayTimeout: 504, // The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server
        HttpVersionNotSupported: 505
});
