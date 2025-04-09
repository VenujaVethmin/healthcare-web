import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: "cm8okqt7o0000ibo0gakxj8cr",
      },
      include: {
        userProfile: true,
        prescriptions:{
          take:1,
          orderBy:{
            createdAt:"desc"
          }
        }
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
      phone,
      location,
      bio,
      bloodType,
      allergies,
      emergencyContact,
      image,
    } = req.body;

    // Input validation
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Get user ID from auth context (you should replace this with proper auth)
    const userId = req.user?.id || "cm8okqt7o0000ibo0gakxj8cr"; // Ideally from auth middleware
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        image,
        userProfile: {
          upsert: {
            update: {
              phone: phone || null,
              bio: bio || null,
              bloodType: bloodType || null,
              allergies: allergies || null,
              emergencyContact: emergencyContact
                ? {
                    name: emergencyContact.name || null,
                    phone: emergencyContact.phone || null,
                  }
                : null,
              address: location || null,
            },
            create: {
              phone: phone || null,
              bio: bio || null,
              bloodType: bloodType || null,
              allergies: allergies || null,
              emergencyContact: emergencyContact
                ? {
                    name: emergencyContact.name || null,
                    phone: emergencyContact.phone || null,
                  }
                : null,
              address: location || null,
            },
          },
        },
      },
      include: { userProfile: true },
    });

    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({
      error: "Failed to update profile",
      message: error.message,
    });
  }
};
export const findDoctors = async (req, res) => {
  try {
    const now = new Date();

    // Convert current time to Sri Lanka's timezone offset (UTC+5:30)
    const sriLankaOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const todaySL = new Date(now.getTime() + sriLankaOffset);

    // Get Sri Lanka's date at midnight
    const today = new Date(
      Date.UTC(
        todaySL.getUTCFullYear(),
        todaySL.getUTCMonth(),
        todaySL.getUTCDate()
      )
    );
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1); // Get next day's UTC midnight

    const doctors = await prisma.user.findMany({
      where: {
        role: "DOCTOR",
        doctorBookingDetails: {
          isPublished: true,
        },
      },
      include: {
        doctorBookingDetails: true,
        doctorProfile: true,
        _count: {
          select: {
            doctorAppointments: {
              where: {
                date: {
                  gte: today, // Start of today in Sri Lanka time (adjusted to UTC)
                  lt: tomorrow, // Start of tomorrow in Sri Lanka time (adjusted to UTC)
                },
              },
            },
          },
        },
      },
    });

    // Return Sri Lanka's date in response
    res.json({ today: todaySL.toISOString().split("T")[0], doctors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
          gte: new Date(dateObj.setHours(0, 0, 0, 0)),
          lte: new Date(dateObj.setHours(23, 59, 59, 999)),
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

//////////////////////////////////////////////////////////////////////////////////////////////

export const bookAppointment = async (req, res) => {
  try {
    const { date, doctorId } = req.body;

    // Validate required fields
    if (!date || !doctorId) {
      return res.status(400).json({ error: "Date and doctorId are required" });
    }

    // Use authenticated user's ID when available
    const patientId = req.user?.id || "cm8okqt7o0000ibo0gakxj8cr";

    // Parse and validate date
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

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
    const day = daysOfWeek[dateObj.getDay()];

    // Fetch doctor details with working hours
    const doctorDetails = await prisma.doctorBookingDetails.findUnique({
      where: { doctorId },
      select: {
        workingHours: {
          where: { day },
        },
        maxPatientsPerDay: true,
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

    // Check appointment capacity
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
          gte: new Date(dateObj.setHours(0, 0, 0, 0)),
          lte: new Date(dateObj.setHours(23, 59, 59, 999)),
        },
      },
    });

    if (appointmentCount >= maxPatients) {
      return res.status(400).json({
        error: "Maximum patients reached for this day",
      });
    }

    // Calculate appointment time
    const lastAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        date: {
          gte: new Date(dateObj.setHours(0, 0, 0, 0)),
          lte: new Date(dateObj.setHours(23, 59, 59, 999)),
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
      // First appointment of the day
      appointmentTime = new Date(dateObj);
      appointmentTime.setHours(startHours, startMinutes, 0, 0);
    } else {
      // Schedule after last appointment with 30-minute interval
      appointmentTime = new Date(lastAppointment.time);
      appointmentTime.setMinutes(appointmentTime.getMinutes() + 30);
    }

    // Validate appointment time is within working hours
    const [endHours, endMinutes] = workingHours.endTime
      ? workingHours.endTime.split(":").map(Number)
      : [23, 59];

    const endTime = new Date(dateObj);
    endTime.setHours(endHours, endMinutes, 0, 0);

    if (appointmentTime > endTime) {
      return res.status(400).json({
        error: "Appointment time exceeds doctor's working hours",
      });
    }

    // Create new appointment
    const newAppointment = await prisma.appointment.create({
      data: {
        doctorId,
        patientId,
        date: dateObj,
        time: appointmentTime,
      },
    });

    return res.status(201).json({
      success: true,
      appointment: newAppointment,
      estimatedTime: appointmentTime,
    });
  } catch (error) {
    console.error("Appointment booking error:", error);
    return res.status(500).json({
      error: "Failed to book appointment",
      message: error.message,
    });
  }
};

//////////////////////////////
// calender

export const calender = async (req, res) => {
  try {
    const today = await prisma.appointment.findMany({
      where: {
        patientId: "cm8okqt7o0000ibo0gakxj8cr",
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },

        status: "Scheduled",
      },
      include: {
        doctor: {
          select: {
            name: true,
          },
        },
      },
    });

    return res.status(200).json({
      calender: today,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPrescription = async (req, res) => {
  try {
    const prescriptions = await prisma.prescription.findMany({
      where: {
        patientId: "cm8okqt7o0000ibo0gakxj8cr",
      },
      include: {
        doctor: {
          select: {
            name: true,
          },
        },
        appointment: {
          select: {
            date: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ prescriptions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const dashboard = async (req, res) => {
  try {
    const nextAppointment = await prisma.appointment.findMany({
      take: 2,
      where: {
        patientId: "cm8okqt7o0000ibo0gakxj8cr",
        status: "Scheduled",
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
      include: {
        doctor: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    const prescription = await prisma.prescription.findFirst({
      where: {
        patientId: "cm8okqt7o0000ibo0gakxj8cr",
      },
      include: {
        doctor: {
          select: {
            name: true,
          },
        },
        appointment:{
          select:{
            pStatus:true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      nextAppointment,
      prescription,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
