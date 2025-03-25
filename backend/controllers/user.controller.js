import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
          where: {
            id: "cm8ak74pd0000ib68agzbmpx8",
          },
          include: {
            userProfile: true,
          },
        });
    
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
