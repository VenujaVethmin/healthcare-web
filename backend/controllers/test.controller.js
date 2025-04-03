import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getUserBooking = async (req, res) => {
  try {
    const { date } = req.body;
    const doctorId = req.params.id;

    // If no date provided, return doctor details only
    if (!date) {
      const doctor = await prisma.doctorBookingDetails.findUnique({
        where: {
          doctorId: doctorId,
        },
        select: {
          workingHours: true,
          doctor: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
            },
          },
          consultationFee: true,
          specialty: true,
          maxPatientsPerDay: true,
        },
      });

      return res.json({ doctor });
    }

    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();
    const daysOfWeek = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    const day = daysOfWeek[dayOfWeek];

    // Get doctor details with working hours for specific day
    const doctor = await prisma.doctorBookingDetails.findUnique({
      where: {
        doctorId: doctorId,
      },
      select: {
        workingHours: {
          where: {
            day: day,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
        consultationFee: true,
        specialty: true,
        maxPatientsPerDay: true,
      },
    });

    // Check if doctor works on this day
    if (!doctor.workingHours.length || !doctor.workingHours[0].isWorking) {
      return res
        .status(400)
        .json({ error: "Doctor is not available on this day" });
    }

    // Get appointments for the day
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctorId,
        date: {
          equals: dateObj,
        },
      },
      orderBy: {
        time: "asc",
      },
    });

    // If no appointments yet, return start time
    if (appointments.length === 0) {
      const estimatedTime = doctor.workingHours[0].startTime;
      return res.json({ doctor, estimatedTime });
    }

    // If appointments exist, calculate next available time
    const lastAppointment = appointments[appointments.length - 1];
    const lastTime = new Date(lastAppointment.time);
    lastTime.setMinutes(lastTime.getMinutes() + 15); // Add 15 minutes for next slot

    const estimatedTime = `${lastTime
      .getHours()
      .toString()
      .padStart(2, "0")}:${lastTime.getMinutes().toString().padStart(2, "0")}`;

    res.json({ doctor, estimatedTime });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ error: error.message });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { doctorId, date } = req.body;
    const userId = req.user.id; // Assuming you have authentication middleware

    const dateObj = new Date(date);
    const appointment = await prisma.appointment.create({
      data: {
        doctorId,
        patientId: userId,
        date: dateObj,
        time: dateObj,
        status: "SCHEDULED",
      },
    });

    res.json({ appointment });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: error.message });
  }
};
