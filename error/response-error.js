class ResponseError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.error = true;
    }
}

export {
    ResponseError
}

// Usage examples:
// throw new ResponseError(400, "Bad Request: Missing required fields");
// throw new ResponseError(404, "Not Found: Customer does not exist");
// throw new ResponseError(500, "Internal Server Error: Unexpected failure");