import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const authenticateJWT = async (req, res, next) => {

  const token = req.headers.authorization?.split(" ")[1];
 

  if (!token) {
    return res.status(401).json({ message: "Missing authorization token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Fetch user from database to attach to request object
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error authenticating JWT:", error);
    return res.status(403).json({ message: "Invalid token" });
  }
};

export default authenticateJWT;
