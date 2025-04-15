import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const test = async (req, res) => {
  try {

    const id = req.user.id;
    const now = new Date();

   

    res.json({ now, id });
  } catch (error) {
    
    res.status(500).json({ error: error.message });
  }
};
