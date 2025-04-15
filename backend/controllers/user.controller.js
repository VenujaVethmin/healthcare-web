import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        userProfile: true,
        prescriptions: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getProfilebyid = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        userProfile: true,
        prescriptions: {
          take: 1,
          orderBy: {
            createdAt: "desc",
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
    const userId = req.user.id; // Ideally from auth middleware
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
    const patientId = req.user.id;

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
      appointmentTime = new Date(new Date(lastAppointment.time).getTime()); // convert to SL time
      appointmentTime.setMinutes(
        appointmentTime.getMinutes() + doctorDetails.appointmentDuration
      );
    }

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
        patientId: req.user.id,
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },

        status: "Scheduled",
      },
      include: {
        doctor: {
          select: {
            name: true,
            doctorBookingDetails:{
              select:{
                room:true,
              }
            }
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
        patientId: req.user.id,
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
    const now = new Date();

    // Calculate the offset for Sri Lanka (UTC+5:30)
    const slOffsetMs = 5.5 * 60 * 60 * 1000;

    // Create a new date adjusted to SL time
    const slNow = new Date(now.getTime() + slOffsetMs);

    // Set SL time to start of the day
    slNow.setHours(0, 0, 0, 0);

    // Convert back to UTC so it matches what your DB expects
    const slStartOfDayUTC = new Date(slNow.getTime() - slOffsetMs);

    const nextAppointment = await prisma.appointment.findMany({
      take: 2,
      where: {
        patientId: req.user.id,
        status: "Scheduled",
        date: {
          gte: slStartOfDayUTC,
        },
      },
      include: {
        doctor: {
          select: {
            name: true,
            doctorBookingDetails: {
              select: {
                room: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    const prescription = await prisma.prescription.findFirst({
      where: {
        patientId: req.user.id,
      },
      include: {
        doctor: {
          select: {
            name: true,
          },
        },
        appointment: {
          select: {
            pStatus: true,
          },
        },
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


export const medicalRecords = async (req,res)=>{
  try {
    const data = await prisma.medicalRecord.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json(
      data
    )
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
