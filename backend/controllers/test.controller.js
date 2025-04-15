import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const test = async (req, res) => {
  try {
    const date = "2025-04-15T18:30:00.000Z";
    const doctorId = "cm8oelbxu0000ibrk1rfgovpu";
    const patientId = "cm9edhwiq0000fh0uwagwah7r";

    // Parse and validate date
    const dateObj = new Date(date); // assume this is in ISO string format

    // Offset for Sri Lanka (UTC+5:30)
    const slOffsetMs = 5.5 * 60 * 60 * 1000;

    // Convert to SL time
    const slDate = new Date(dateObj.getTime() + slOffsetMs);

    // Start and end of SL day in SL time
    const slStartOfDay = new Date(slDate);
    slStartOfDay.setHours(0, 0, 0, 0);

    const slEndOfDay = new Date(slDate);
    slEndOfDay.setHours(23, 59, 59, 999);

    // Convert back to UTC for DB queries
    const startOfDayUTC = new Date(slStartOfDay.getTime() - slOffsetMs);
    const endOfDayUTC = new Date(slEndOfDay.getTime() - slOffsetMs);

    // Get day of week
    const daysOfWeek = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    const day = daysOfWeek[slDate.getDay()];

    const doctorDetails = await prisma.doctorBookingDetails.findUnique({
      where: { doctorId },
      select: {
        workingHours: {
          where: { day },
        },
        maxPatientsPerDay: true,
        appointmentDuration: true,
      },
    });

    if (!doctorDetails) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    if (!doctorDetails.workingHours.length) {
      return res.status(400).json({
        error: "Doctor is not available on this day",
      });
    }
 const maxPatients = parseInt(doctorDetails.maxPatientsPerDay, 10);
 if (!maxPatients || maxPatients <= 0) {
   return res.status(500).json({
     error: "Invalid maximum patients configuration",
   });
 }
    const appointmentCount = await prisma.appointment.count({
      where: {
        doctorId,
        date: {
          gte: startOfDayUTC,
          lte: endOfDayUTC,
        },
      },
    });


    
    if (appointmentCount >= maxPatients) {
      return res.status(400).json({
        error: "Maximum patients reached for this day",
      });
    }


    const lastAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        date: {
          gte: startOfDayUTC,
          lte: endOfDayUTC,
        },
      },
      select: { time: true },
      orderBy: { time: "desc" },
    });

    const workingHours = doctorDetails.workingHours[0];
    const [startHours, startMinutes] = workingHours.startTime
      .split(":")
      .map(Number);


    let appointmentTime;

    if (!lastAppointment) {
      appointmentTime = new Date(slStartOfDay); // use SL day start
      appointmentTime.setHours(startHours, startMinutes, 0, 0);
    } else {
      appointmentTime = new Date(
        new Date(lastAppointment.time).getTime()
      ); // convert to SL time
      appointmentTime.setMinutes(appointmentTime.getMinutes() + doctorDetails.appointmentDuration);
    }


        const newAppointment = await prisma.appointment.create({
          data: {
            doctorId,
            patientId,
            date: dateObj,
            time: appointmentTime,
          },
        });

    res.json({ appointmentTime, lastAppointment, newAppointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
