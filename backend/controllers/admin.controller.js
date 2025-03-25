import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();



export const findUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await prisma.user.findFirst({
      where: { email, role: "PATIENT" },
    });

    if (!user) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const doctorList = async (req, res) => {
  try {
    const doctors = await prisma.user.findMany({
      where:{
        role: "DOCTOR"
      }
    });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const makeDoctor = async (req, res) => {
  try {
    const {
      userId
    } = req.body;

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

      // Create working hours for the doctor
      const workingHoursData = daysOfWeek.map((day) => ({
        day,
      }));

      const workingHours = await prisma.workingHour.createMany({
        data: workingHoursData,
      });

      return { user, doctorBooking, workingHours };
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
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};







//create and update doctor schedule
export const doctorSchedule = async (req, res) => {
  try {
    const doctorBooking = await prisma.doctorBookingDetails.create({
      data: {
        doctorId: "cm8ocim2j0000ibu8jba6eghq",
        specialty: "hi",
        appointmentDuration: 15,
        maxPatientsPerDay: 20,
        consultationFee: 2500,
        isPublished: false,
      },
    });

    const daysOfWeek = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];

    const workingHoursData = daysOfWeek.map((day) => ({
      day,
    }));

    const workingHours = await prisma.$transaction(
      workingHoursData.map((wh) => prisma.workingHour.create({ data: wh }))
    );

    res.json({ message: "Doctor and working hours created!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


