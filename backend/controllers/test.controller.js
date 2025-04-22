import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const test = async (req, res) => {
  try {
     const data = await prisma.user.findMany()

    res.json({ data});
  } catch (error) {
    console.error("Error in scheduling:", error);
    res.status(500).json({ error: error.message });
  }
};
