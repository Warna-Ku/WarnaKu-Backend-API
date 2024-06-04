import { validate } from "../validation/validation.js";
import { getUserValidation, loginUserValidation, registerUserValidation, updateUserValidation } from "../validation/user-validation.js";
import { prismaClient } from "../application/database.js"
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// import { v4 as uuid } from "uuid";

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    //To Check if the email is already registered/exist
    const countUser = await prismaClient.user.count({
        where: {
            email: user.email
        }
    });

    if (countUser === 1) {
        throw new ResponseError(400, "Email's already registered")
    }

    user.password = await bcrypt.hash(user.password, 10);

    //If the user's not existed => create account
    return prismaClient.user.create({
        data: user,
        select: {
            uid: true,
            email: true,
            name: true
        }
    });
}

const login = async (req) => {
    const loginRequest = validate(loginUserValidation, req);

    const user = await prismaClient.user.findUnique({
        where: {
            email: loginRequest.email
        },
        select: {
            uid: true,
            email: true,
            password: true
        }
    });

    if (!user) {
        throw new ResponseError(401, "Email or password incorrect");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

    if (!isPasswordValid) {
        throw new ResponseError(401, "Email or password incorrect");
    }

    const payload = {
        uid: user.uid,
        email: user.email
    };

    //Generate JWT Token
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });

    // Check if user already has a token in database
    const existingUserWithToken = await prismaClient.user.findUnique({
        where: {
            uid: user.uid
        },
        select: {
            token: true
        }
    });

    if (existingUserWithToken && existingUserWithToken.token) {
        // Token already exists, update with new token if necessary
        if (existingUserWithToken.token !== token) {
            // Update the existing token with the new token
            await prismaClient.user.update({
                where: {
                    uid: user.uid
                },
                data: {
                    token: token
                }
            });
        }
    } else {
        // No token exists, create new token
        await prismaClient.user.update({
            where: {
                uid: user.uid
            },
            data: {
                token: token
            }
        });
    }

    return {
        uid: user.uid,
        email: user.email,
        token: token
    };
};

const logout = async (req) => {
    logoutRequest = validate(getUserValidation, req);

    const user = await prismaClient.user.findUnique({
        where: {
            uid: logoutRequest.uid
        }
    });

    if (!user) {
        throw new ResponseError(404, "User is not found. User can't log out")
    }

    return prismaClient.user.update({
        where: {
            uid: user.uid
        },
        data: {
            token: null
        },
        select: {
            uid: true
        }
    });
}

const getAllUser = async () => {
    const users = await prismaClient.user.findMany({
        select: {
            uid: true,
            email: true,
            name: true
        }
    });
    
    return users;
}

const getCertainUser = async (uid) => {
    // No need to validate uid again here; it's assumed valid from the controller
    // validUid = validate(getUserValidation, { uid });

    const user = await prismaClient.user.findUnique({
        where: {
            uid: uid
        },
        select: {
            uid: true,
            email: true,
            name: true,
        }
    });

    if (!user) {
        throw new ResponseError(404, 'User is not found');
    }

    return user;
};

//Using "default" cause can export more than one object/variables
export default {
    register,
    login,
    logout,
    getAllUser,
    getCertainUser
}