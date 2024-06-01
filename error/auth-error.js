export class tokenVerificationError extends Error {
    constructor(message) {
        super(message);  
        this.name = "tokenVerificationError";      
    }
}

export class missingAccessTokenError extends Error {
    constructor(message) {
        super(message);
        this.name = "missingAccessToken";
    }
}

export const tokenVerificationErrorHandler = (
    msg = "Invalid token or Expired token (Can't compare secret key with token)", 
    res
) => {
    res.status(403).send({
        status: "fail",
        message: msg
    })
};

export const missingAccessTokenHandler = (
    msg = "Unauthorized access. Please provide the proper access token",
    res
) => {
    res.status(401).send({
        status: "fail",
        message: msg 
    });
}

