import multer from "multer";
import path from 'path'

const storage = multer.diskStorage({
    // destination:'./public/uploads',
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })

export const upload = multer({ storage: storage })