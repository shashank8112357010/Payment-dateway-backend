const multer = require('multer');
const path = require('path');

// Variable for allowed max size of file: (max 1MB)
const maxSize = 1 * 1000 * 1000;

// SET STORAGE ENGINE: 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// INTITIALIZE UPLOAD: 
module.exports.upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('profileImg');


// CHECKING FILE TYPE: 
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    // console.log("extension: ", path.extname(file.originalname).toLowerCase());
    // console.log("mimetype: ", file.mimetype)

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('ERROR: File Type Not Valid.. Should be jpg/jpeg/png format..')
    }
}