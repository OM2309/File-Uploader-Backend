import multer from "multer";
import fs from "fs";

const createDirectoryIfNotExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const username = req.user.id;

    const destinationFolder = `./uploads/${username}`;

    createDirectoryIfNotExists(destinationFolder);

    cb(null, destinationFolder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

export default upload;
