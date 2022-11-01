const multer = require("multer");

const FILEEXTANSION = {
    'image/jpg':'jpg',
    'image/jpeg':'jpg',
    'image/png': 'png'
}

const storage = multer.diskStorage({
    destination:  (req, file, cb) => {
      cb(null, 'images')
    },
    filename: (req, file, cb) =>{
      const name = file.originalname.split(' ').join('_');
      const extension = FILEEXTANSION[file.mimetype];      
      cb(null, name+'_' + Date.now()+'.'+extension);
    }
  });

  module.exports = multer({ storage }).single('image');