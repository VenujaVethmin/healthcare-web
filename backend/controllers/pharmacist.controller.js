import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const pharmacistDashboard = async (req, res) => {
  try {

    const totalPrescriptions = await prisma.appointment.count({
      where: {
       
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });

    const pending = await prisma.appointment.count({
      where: {
        pStatus: "PENDING",
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });

    
    const ready = await prisma.appointment.count({
      where: {
        pStatus: "READY",
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
      const completed = await prisma.appointment.count({
        where: {
          pStatus: "COMPLETED",
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lte: new Date(new Date().setHours(23, 59, 59, 999)),
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
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
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