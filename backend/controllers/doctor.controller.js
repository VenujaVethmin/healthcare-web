import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
          where: {
            id: "cm8ak74pd0000ib68agzbmpx8",
          },
          include: {
           doctorProfile : true,
          },
        });
    
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
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

    res.json({ message: "Appointment updated & future appointments rescheduled", appointment: updatedAppointment });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
