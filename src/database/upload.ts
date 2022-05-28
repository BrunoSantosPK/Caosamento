import path from "path";
import multer from "multer";

const uploadPhoto = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, "..", "public"))
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`)
        }
    }),
    fileFilter: (req, file, cb) => {
        if(["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype))
            cb(null, true);
        else {
            cb(null, false);
            return cb(new Error("Permitido apenas imagens jpeg, jpg ou png."));
        }
    }
});

export default uploadPhoto;