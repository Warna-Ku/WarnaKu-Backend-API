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

imgUpload.storeToGCS = async (req, res, next) => {
    try {
        if (!req.file) return next();

        const originalExtension = path.extname(req.file.originalname);
        const mimeType = req.file.mimetype;

        // Checking if the file's type is allowed
        if (!allowedImageTypes.includes(mimeType)) {
            return res.status(400).json({
                error: 'The allowed image types are only JPEG, JPG, and PNG'
            });
        }

        // Specify the folder path where we want to store the file
        const folderPath = 'users/' //folder /users inside bucket
        const objectGCSname = `${folderPath}${uuidv4()}${originalExtension}`;
        const uploadedFile = bucket.file(objectGCSname);

        const stream = uploadedFile.createWriteStream({
            metadata: {
                contentType: mimeType
            }
        });

        stream.on('error', (err) => {
            req.file.cloudStorageError = err;
            next(err);
        });

        stream.on('finish', () => {
            req.file.cloudStorageObject = objectGCSname;
            req.file.cloudStoragePublicUrl = getPublicURL(objectGCSname);
            next();
        });

        stream.end(req.file.buffer);
    } catch (error) {
        console.error('Error uploading to GCS:', error);
        next(error);
    }
};

export default imgUpload;