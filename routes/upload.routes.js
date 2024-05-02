import express from "express";
import {
  uploadFiles,
  deleteFiles,
  getAllFilesByUser,
  getOnlyOneFile
} from "../controllers/uploadController.js";
import upload from "../utils/upload_files.js";
import authenticateJWT from "../middleware/authenticateJWT.js";

const routes = express.Router();

routes.get("/one/:fileId", authenticateJWT, getOnlyOneFile);
routes.get("/all", authenticateJWT, getAllFilesByUser);
routes.post("/upload", authenticateJWT, upload.single("file"), uploadFiles);
routes.delete("/delete/:fileId", authenticateJWT, deleteFiles);

export default routes;
