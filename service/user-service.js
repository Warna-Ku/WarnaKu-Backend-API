import { validate } from "../validation/validation.js";
import imgUpload from '../utils/storeToGCS.js';
import { getUserValidation, loginUserValidation, registerUserValidation, updateUserValidation } from "../validation/user-validation.js";
import { prismaClient } from "../application/database.js"
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// import { v4 as uuid } from "uuid";

const uploadImageToGCS = async (file, folderPath) => {
    const req = { file };
    const res = {};
    await imgUpload.storeToGCS(req, res, () => { }, folderPath);

    if (req.file.cloudStorageError) {
        throw new ResponseError(500, 'Failed to upload image to GCS')
    }

    return req.file.cloudStoragePublicUrl;
}

const register = async (request) => {
    // Extract profile_photo_url from request
    const { profile_photo_url, ...userData } = request;

    const user = validate(registerUserValidation, userData);

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

    // Upload profile photo to GCS and get public URL
    if (!profile_photo_url) {
        user.faceImageURL = await uploadImageToGCS(profile_photo_url, 'users/');
    }

    //If the user's not existed => create account
    const createdUser = await prismaClient.user.create({
        data: user,
        select: {
            uid: true,
            email: true,
            name: true,
            faceImageURL: true
        }
    });

    //Return user data with profile
    return createdUser;
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
            name: true,
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
        name: user.name,
        email: user.email
    };

    //Generate JWT Token
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1d" });

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
        name: user.name,
        token: token
    };
};

const update = async (request) => {
    const updateRequestUser = validate(updateUserValidation, request);

    if (!updateRequestUser.uid) {
        throw new ResponseError(400, "User ID is required for update");
    }

    const userInDatabase = await prismaClient.user.count({
        where: {
            uid: updateRequestUser.uid
        }
    });

    //If user's not found
    if (userInDatabase !== 1) {
        throw new ResponseError(404, "User is not found");
    }

    const data = {};
    //If the user has uid properties then update
    if (updateRequestUser.email) {
        data.email = updateRequestUser.email;
    }

    if (updateRequestUser.password) {
        data.password = await bcrypt.hash(updateRequestUser.password, 10);
    }

    if (updateRequestUser.name) {
        data.name = updateRequestUser.name;
    }

    return prismaClient.user.update({
        where: {
            uid: updateRequestUser.uid
        },
        data: data,
        select: {
            email: true,
            name: true
        }
    });
};

const logout = async (req) => {
    const userId = req.uid;

    if (!userId) {
        throw new ResponseError(400, "User ID is required for logout");
    }

    const user = await prismaClient.user.findUnique({
        where: {
            uid: userId
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

    if (!users.length) {
        throw new ResponseError(404, "No users found");
    }

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
        throw new ResponseError(404, 'User\'s is not found');
    }

    return user;
};

//Using "default" cause can export more than one object/variables
export default {
    register,
    login,
    update,
    logout,
    getAllUser,
    getCertainUser
}