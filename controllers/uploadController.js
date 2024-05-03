import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const uploadFiles = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    

    const { originalname, mimetype } = req.file;
    const timestamp = Date.now().toString();

    const uploadedFile = await prisma.upload.create({
      data: {
        name: req.file.filename,
        type: mimetype,

        user: {
          connect: { id: req.user.id },
        },
      },
    });

    res.status(200).json({
      status: "success",
      message: "File uploaded successfully",

      data: {
        id: uploadedFile.id,
        name: uploadedFile.name,
        imageUrl: `/uploads/${req.file.userID}/${req.file.filename}`,
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Error uploading file" });
  }
};

export const deleteFiles = async (req, res) => {
  try {
    const { fileId } = req.params;

    const existingFile = await prisma.upload.findUnique({
      where: { id: fileId },
    });

    if (!existingFile) {
      return res.status(404).json({ message: "File not found" });
    }

    // Ensure that only the owner of the file can delete it
    if (existingFile.userID !== req.user.id && !(req.user.role == "admin")) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this file" });
    }

    await prisma.upload.delete({
      where: { id: fileId },
    });

    res.status(200).json({
      status: "success",
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Error deleting file" });
  }
};

export const getAllFilesByUser = async (req, res) => {
  try {
    // Check if req.user or req.user.id is undefined
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;
    let userFiles = []

    if(req.user.role == "admin"){
      userFiles = await prisma.upload.findMany({
        include: {
          user: true,
        }
      })
    }else{
      userFiles = await prisma.upload.findMany({
        where: { userID: userId },
      });
    }

    if (userFiles.length === 0) {
      return res.status(404).json({ message: "No files found for this user" });
    }

    const filesWithUrls = userFiles.map((file) => ({
      ...file,
      imageUrl: `/uploads/${file.userID}/${file.name}`,
    }));

    res.status(200).json({
      status: "success",
      message: "Files retrieved successfully",
      data: filesWithUrls, // Return files with image URLs
    });
  } catch (error) {
    console.error("Error retrieving files:", error);
    res.status(500).json({ message: "Error retrieving files" });
  }
};

export const getOnlyOneFile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { fileId } = req.params;

    const file = await prisma.upload.findFirst({
      where: { id: fileId },
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    
    if (file.userID !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to access this file" });
    }

    // Return the file data
    res.status(200).json({
      status: "success",
      message: "File retrieved successfully",
      data: file,
    });
  } catch (error) {
    console.error("Error retrieving file:", error);
    res.status(500).json({ message: "Error retrieving file" });
  }
};

export const getMe = async (req, res) => {
  res.status(200).json(req.user);
}