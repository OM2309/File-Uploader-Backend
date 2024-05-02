import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
const app = express();
import path from 'path';
import { fileURLToPath } from 'url';
// Miiddleware
app.use(cors());

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadFolderPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadFolderPath));



// Api Routes
app.use("/api", userRoutes);
app.use("/api", uploadRoutes);

const PORT = process.env.PORT;

app.listen(PORT, async () => {
  console.log(`listening on port http://localhost:${PORT}`);
});
