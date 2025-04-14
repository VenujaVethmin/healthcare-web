import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const test = async (req, res) => {
  try {

    const id = req.user.id;
    const data = await prisma.appointment.findMany({
      take: 2,
      where: {
        patientId: req.user.id,
        
        
      },
     
      orderBy: {
        date: "asc",
      },
    });

    res.json({data , id});
  } catch (error) {
    
    res.status(500).json({ error: error.message });
  }
};
