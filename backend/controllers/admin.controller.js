import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const adminDashboard = async (req, res) => {
  try {
    const data = await prisma.user.findMany({
      where: {
        role: "DOCTOR",
      },
      include: {
        doctorProfile: {
          select: {
            education: true,
            specialty: true,
          },
        },
        doctorBookingDetails: {
          select: {
            consultationFee: true,
            isPublished: true,
          },
        },
      },
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const findUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase(), role: "PATIENT" },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const doctorList = async (req, res) => {
  try {
    const doctors = await prisma.user.findMany({
      where: {
        role: "DOCTOR",
      },
    });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const makeDoctor = async (req, res) => {
  try {
    const { userId } = req.body;

    const daysOfWeek = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];

    // Perform all operations inside a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Update user role to DOCTOR
      const user = await prisma.user.update({
        where: { id: userId },
        data: { role: "DOCTOR" },
      });

      // Create doctor booking details
      const doctorBooking = await prisma.doctorBookingDetails.create({
        data: {
          doctorId: user.id,
          appointmentDuration: 15,
          maxPatientsPerDay: 20,
          consultationFee: 2500,
          isPublished: false,
        },
      });

      // Create working hours for the doctor with doctorBookingDetailsId
      const workingHoursData = daysOfWeek.map((day) => ({
        day,
        doctorBookingDetailsId: doctorBooking.id, // ✅ Foreign key included
      }));

      await prisma.workingHour.createMany({
        data: workingHoursData,
      });

      return { user, doctorBooking, workingHours: workingHoursData };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get doctors shedules details

export const doctorSchedule = async (req, res) => {
  try {
    const doctors = await prisma.doctorBookingDetails.findMany({
      include: {
        workingHours: true,
        doctor: true,
      },
    });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDoctorSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      workingHours,
      appointmentDuration,
      maxPatientsPerDay,
      consultationFee,
      specialty,
      room
    } = req.body;

    // Update doctor booking details
    const updatedDoctor = await prisma.$transaction(async (prisma) => {
      // Update main doctor booking details
      const doctorBooking = await prisma.doctorBookingDetails.update({
        where: { id },
        data: {
          appointmentDuration,
          maxPatientsPerDay,
          consultationFee,
          specialty,
          room,
        },
      });

      // Update working hours
      for (const hour of workingHours) {
        await prisma.workingHour.update({
          where: { id: hour.id },
          data: {
            startTime: hour.startTime,
            endTime: hour.endTime,
            isWorking: hour.isWorking,
          },
        });
      }

      return doctorBooking;
    });

    res.json({ success: true, data: updatedDoctor });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    const doctorCount = await prisma.user.count({
      where: {
        role: "DOCTOR",
      },
    });

    const patientCount = await prisma.user.count({
      where: {
        role: "PATIENT",
      },
    });

    const todayAppointmentCount = await prisma.appointment.count({
      where: {
        date: {
          gte: startUTC, // Start of today (00:00)
          lte: endUTC, // End of today (23:59:59.999)
        },
      },
    });

    const card = await prisma.doctorBookingDetails.findMany({
      include: {
        doctor: {
          select: {
            name: true,
            _count: {
              select: {
                doctorAppointments: {
                  where: {
                    date: {
                      gte: startUTC, // Start of today (00:00)
                      lte: endUTC, // End of today (23:59:59.999)
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    res.json({
      doctorCount,
      patientCount,
      todayAppointmentCount,
      card,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updatePublishStatus = async (req, res) => {

  try {
    const data = await prisma.doctorBookingDetails.update({
      where: {
        id: req.params.id,
      },
      data: {
        isPublished: req.body.isPublished,
      },
    });
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
    
  }
}




export const deleteDoctorData = async (req ,res) => {
  try {

    const { doctorId } = req.params; // Get doctorId from request parameters
    // 1. Find DoctorBookingDetails ID
    const bookingDetails = await prisma.doctorBookingDetails.findUnique({
      where: { doctorId },
    });

    // 2. Delete WorkingHours if DoctorBookingDetails exists
    if (bookingDetails) {
      await prisma.workingHour.deleteMany({
        where: { doctorBookingDetailsId: bookingDetails.id },
      });

      // 3. Delete DoctorBookingDetails
      await prisma.doctorBookingDetails.delete({
        where: { doctorId },
      });
    }

    // 4. Delete DoctorProfile
    await prisma.doctorProfile.delete({
      where: { userId: doctorId },
    });

    await prisma.user.update(
      {
        where: { id: doctorId },
        data: {
          role: "PATIENT", // Change role to PATIENT
        }, // Change role to PATIENT
      }
    )

    return res.status(200).json({ message: "Doctor profile and booking details deleted successfully." }); 

    console.log("Doctor profile and booking details deleted successfully.");
  } catch (error) {
    console.error("Error deleting doctor data:", error);
  }
};
