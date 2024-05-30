class ResponseError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

export {
    ResponseError
}

// Throw response error and we'll catch in the middleware and convert the error