import { config } from 'dotenv';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Load environment variables
config();

const base64EncodedServiceAccount = process.env.BASE64_ENCODED_SERVICE_ACCOUNT;
const decodedServiceAccount = Buffer.from(base64EncodedServiceAccount, 'base64').toString('utf-8');
const credentials = JSON.parse(decodedServiceAccount);

// Initialize Google Cloud Storage
const storageGCS = new Storage({
    // projectId: process.env.GCS_PROJECT_ID,
    credentials
});

const nameBucket = process.env.GCS_BUCKET_NAME;
const bucket = storageGCS.bucket(nameBucket);

const getPublicURL = (filename) => `https://storage.googleapis.com/${nameBucket}/${filename}`;

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

const imgUpload = {};

imgUpload.storeToGCS = async (req, res, next, folderPath) => { // Make sure 'next' is a parameter here
    try {
        if (!req.file) return next();

        // Ensure req.file.originalname exists and is a string
        // if (typeof req.file.originalname !== 'string') {
        //     throw new Error('Invalid file uploaded');
        // }

        const originalExtension = path.extname(req.file.originalname);
        const mimeType = req.file.mimetype;

        // Checking if the file's type is allowed
        if (!allowedImageTypes.includes(mimeType)) {
            throw new Error('The allowed image types are only JPEG, JPG, and PNG');
        }

        // Specify the folder path where we want to store the file
        const objectGCSname = `${folderPath}${uuidv4()}${originalExtension}`;
        const uploadedFile = bucket.file(objectGCSname);

        const stream = uploadedFile.createWriteStream({
            metadata: {
                contentType: mimeType,
                predefinedAcl: 'publicRead'
            }
        });

        // Handle stream errors
        stream.on('error', (err) => {
            req.file.cloudStorageError = err;
            next(err);
        });

        // Handle stream finish event (file upload success)
        stream.on('finish', () => {
            req.file.cloudStorageObject = objectGCSname; // Store GCS object name in request object
            req.file.cloudStoragePublicUrl = getPublicURL(objectGCSname); // Generate public URL
            next(); // Proceed to next middleware
        });

        stream.end(req.file.buffer);
    } catch (error) {
        console.error('Error uploading to GCS:', error);
        next(error); // Pass error to the next middleware
    }
};

export default imgUpload;
