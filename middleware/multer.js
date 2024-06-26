import Multer from 'multer';

const multer = Multer({
    storage: Multer.MemoryStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});

export default multer;
