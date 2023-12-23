import { extname } from "path";
import { getConfig } from "@utils/configUtils";

export const fileFilter = (req, file, callback) => {
  const allowedFileExtensions = getConfig().allowedFileExtensions;

  const ext = extname(file.originalname).toLowerCase();

  if (allowedFileExtensions.includes(ext)) {
    return callback(null, true);
  }

  return callback(new Error("Only PDF, Word, JPG/JPEG, PNG, TXT extensions are allowed."));
};


//In case we need to store the files on server

// export const editFileName = (req, file, callback) => {
//   const name = file.originalname.split(".")[0];
//   const fileExtName = extname(file.originalname);
//   const randomName = Array(4)
//     .fill(null)
//     .map(() => Math.round(Math.random() * 16).toString(16))
//     .join("");
//   callback(null, `${name}-${randomName}${fileExtName}`);
// };
