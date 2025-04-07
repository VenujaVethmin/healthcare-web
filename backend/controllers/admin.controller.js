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
          gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of today (00:00)
          lte: new Date(new Date().setHours(23, 59, 59, 999)), // End of today (23:59:59.999)
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
                      gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of today (00:00)
                      lte: new Date(new Date().setHours(23, 59, 59, 999)), // End of today (23:59:59.999)
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
    const res = await prisma.doctorBookingDetails.update({
      where: {
        id: req.params.id,
      },
      data: {
        isPublished: req.body.isPublished,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    
  }
}