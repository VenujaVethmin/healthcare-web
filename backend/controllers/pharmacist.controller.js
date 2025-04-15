import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const pharmacistDashboard = async (req, res) => {
  try {

      const nowUTC = new Date(); // Current UTC time

      // Sri Lanka is UTC+5:30 → add 5.5 hours to UTC to get SL time
      const slNow = new Date(nowUTC.getTime() + 5.5 * 60 * 60 * 1000);

      // Get Sri Lankan start & end of day in SL time
      const slStart = new Date(slNow.setHours(0, 0, 0, 0));
      const slEnd = new Date(slNow.setHours(23, 59, 59, 999));

      // Move SL time to tomorrow
      const slTomorrowStart = new Date(slStart);
      slTomorrowStart.setDate(slTomorrowStart.getDate() + 1);
      slTomorrowStart.setHours(0, 0, 0, 0);

      // Convert those back to UTC
      const startUTC = new Date(slStart.getTime() - 5.5 * 60 * 60 * 1000);
      const endUTC = new Date(slEnd.getTime() - 5.5 * 60 * 60 * 1000);
      const startOfTomorrowUTC = new Date(
        slTomorrowStart.getTime() - 5.5 * 60 * 60 * 1000
      );

    const totalPrescriptions = await prisma.appointment.count({
      where: {
        date: {
          gte: startUTC,
          lte: endUTC,
        },
      },
    });

    const pending = await prisma.appointment.count({
      where: {
        pStatus: "PENDING",
        date: {
          gte: startUTC,
          lte: endUTC,
        },
      },
    });

    
    const ready = await prisma.appointment.count({
      where: {
        pStatus: "READY",
        date: {
          gte: startUTC,
          lte: endUTC,
        },
      },
    });
      const completed = await prisma.appointment.count({
        where: {
          pStatus: "COMPLETED",
          date: {
            gte: startUTC,
            lte: endUTC,
          },
        },
      });

    const data = await prisma.appointment.findMany({
      where: {
        pStatus: {
          in: ["READY", "PENDING"],
        },
        status: "COMPLETED",
        date: {
          gte: startUTC,
          lte: endUTC,
        },
      },
      select: {
        number: true,
        prescriptions: true,
        patient: {
          select: {
            name: true,
          },
        },
        doctor: {
          select: {
            name: true,
          },
        },
        date: true,
        pStatus: true,
      },
    });
    res.json({ totalPrescriptions, pending, ready, completed, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const pStatusChange = async (req,res)=>{
  try {
    const { id } = req.params; 
    const { pStatus } = req.body;

    const updatedPrescription = await prisma.prescription.update({
      where: {
        id: id,
      },
      data: {
        // Assuming you want to update the appointment's pStatus through the prescription
        appointment: {
          update: {
            pStatus: pStatus,
          },
        },
      },
    });

    return res.status(200).json(updatedPrescription);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
    
  }
}



export const getUserInfo = async (req, res) => {

  try {
    const data = await prisma.user.findUnique({
      where: {
        email: req.params.email,
      },

      include:{
        medicalRecords : true
      }

     
    });

    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
    
  }

}