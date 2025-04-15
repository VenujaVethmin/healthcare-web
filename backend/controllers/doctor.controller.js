import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        doctorProfile: true,
        doctorBookingDetails: {
          select: {
            workingHours: true,
          },
        },
      },
    });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getProfileById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        doctorProfile: true,
        doctorBookingDetails: {
          select: {
            workingHours: true,
          },
        },
      },
    });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      image,
      bio,
      specialty,
      experience,
      qualifications,
      education,
    } = req.body;

    const userId = req.user.id; // Should come from req.user.id

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        image,
        doctorProfile: {
          upsert: {
            update: {
              bio,
              specialty,
              experience,
              qualifications,
              education,
            },
            create: {
              bio,
              specialty,
              experience,
              qualifications,
              education,
            },
          },
        },
      },
      include: {
        doctorProfile: true,
      },
    });

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      error: "Failed to update profile",
      message: error.message,
    });
  }
};


// Helper function to convert time to Sri Lanka time (UTC+5:30)
const convertToSriLankaTime = (time) => {
  const sriLankaOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
  const sriLankaTime = new Date(time.getTime() + sriLankaOffset);
  return sriLankaTime;
};

// 📌 Function to adjust all future appointments dynamically (in Sri Lankan time) for the specific day
const adjustFutureAppointments = async (doctorId, date, fromTime) => {
  // Convert `date` to start of the day (00:00) and end of the day (23:59) in UTC
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0); // Set the time to 00:00:00 UTC

  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999); // Set the time to 23:59:59 UTC

  // Fetch appointments for the specific day and after the fromTime
  const futureAppointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      date: {
        gte: startOfDay, // Start of the day in UTC
        lte: endOfDay, // End of the day in UTC
      },
      time: { gte: fromTime }, // Get appointments after this time
    },
    orderBy: { time: "asc" }, // Order by appointment time
  });

  let newStartTime = fromTime;

  // Loop over the future appointments to adjust their times
  for (const appointment of futureAppointments) {
    const newEndTime = addMinutes(newStartTime, 15); // Default 15 minutes per appointment

    // Convert both newStartTime and newEndTime to Sri Lankan time before saving
    const sriLankaStartTime = convertToSriLankaTime(new Date(newStartTime));
    const sriLankaEndTime = convertToSriLankaTime(new Date(newEndTime));

    await prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        time: sriLankaStartTime, // Save in Sri Lanka time
        expectedEndTime: sriLankaEndTime, // Save in Sri Lanka time
      },
    });

    newStartTime = newEndTime; // Shift next appointment time
  }
};

// API to update an appointment's actual end time
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { actualEndTime } = req.body;

    // Convert `actualEndTime` to Date object
    const actualEnd = new Date(actualEndTime);

    // Update the appointment with actual end time
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { actualEndTime: actualEnd },
    });

    // Get all future appointments that need rescheduling
    await adjustFutureAppointments(
      updatedAppointment.doctorId,
      updatedAppointment.date,
      actualEnd
    );

    res.json({
      message: "Appointment updated & future appointments rescheduled",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const dashboard = async (req, res) => {
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

    // Count appointments for today
    const todayCount = await prisma.appointment.count({
      where: {
        date: {
          gte: startUTC, // Start of today (00:00)
          lte: endUTC, // End of today (23:59:59.999)
        },
        status: "Scheduled",
      },
    });

    // Count upcoming appointments (appointments after today)
    const upcomingCount = await prisma.appointment.count({
      where: {
        date: {
          gte: startOfTomorrowUTC, // Start of tomorrow (after today)
        },
      },
    });

    const completedCount = await prisma.appointment.count({
      where: {
        date: { 
          gte: startUTC, // Start of today (00:00)
          lte: endUTC, // End of today (23:59:59.999)
        },
        status: "COMPLETED",
      },
    });

    const appoinments = await prisma.appointment.findMany({
      where: {
        doctorId: req.user.id,
        date: {
          gte: startUTC, // Start of today (00:00)
          lte: endUTC, // End of today (23:59:59.999)
        },
        status: "Scheduled",
      },

      include: {
        patient: {
          select: {
            id: true,
            name: true,
            image: true,
            userProfile: true,
          },
        },
      },
    });

    // Return the result as JSON
    res.json({
      todayCount,
      upcomingCount: upcomingCount,
      appoinments,
      completedCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const calender = async (req, res) => {
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

    const today = await prisma.appointment.findMany({
      where: {
        doctorId: req.user.id,
        date: {
          gte: startUTC,
        },

        status: "Scheduled",
      },
      include: {
        patient: {
          select: {
            name: true,
          },
        },
        doctor:{
          select:{
            doctorBookingDetails:{
              select:{
                room: true,
              }
            }
          }
        }
      },
    });

    return res.status(200).json({
      calender: today,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPrescription = async (req, res) => {
  try {
    const { appointmentId, patientId, medicine, notes } = req.body;

    const newPrescription = await prisma.prescription.create({
      data: {
        appointmentId,
        doctorId: req.user.id,
        patientId,
        medicine, // JSON array of medicines
        notes,
      },
    });

    const updatedAppointment = await prisma.appointment.update({
      where: { id: newPrescription.appointmentId },
      data: {
        status: "COMPLETED",
      }, // Update the appointment status to "Completed"
    });

    res.json({ newPrescription, updatedAppointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
