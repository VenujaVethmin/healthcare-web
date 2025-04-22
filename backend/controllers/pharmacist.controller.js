import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../lib/sendEmail.js";

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

      select: {
        appointment: {
          select: {
            pStatus: true,
          },
        },
        patient: {
          select: {
            email: true,
            name: true,
          },
        },

        doctor: {
          select: {
            name: true,
          },
        },
      },
    });

 

    if (updatedPrescription.appointment.pStatus === "READY") {
      const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #3a99b7; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Prescription Ready</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #eee;">
        <p style="font-size: 16px; color: #333;">Hi ${updatedPrescription.patient.name},</p>
        <p style="font-size: 16px; line-height: 1.5; color: #444;">
          Your prescription by Dr.${updatedPrescription.doctor.name} is ready for pickup at our pharmacy. Please visit us during our operating hours to collect your medications.
        </p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #3a99b7; margin-top: 0;">Pickup Details:</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 10px;">📋 Bring your ID for verification</li>
          </ul>
        </div>
        <p style="font-size: 14px; color: #666; border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;">
          If you have any questions, please contact our pharmacy department.
        </p>
      </div>
      <div style="background-color: #f8f9fa; padding: 15px; text-align: center;">
        <p style="color: #666; margin: 0; font-size: 12px;">
          This is an automated message, please do not reply to this email.
        </p>
      </div>
    </div>
  `;

      const textContent =
        "Your prescription is ready for pickup. Please visit the pharmacy to collect it. Location: Hospital Pharmacy, Hours: 8:00 AM - 8:00 PM";

      await sendEmail(
        updatedPrescription.patient.email,
        "Prescription Ready for Pickup",
        textContent,
        htmlContent
      );
    }

    

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