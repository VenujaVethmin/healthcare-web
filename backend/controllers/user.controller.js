import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../lib/sendEmail.js";
import cron from "node-cron";

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

    const utcTime = dateObj.getTime();

    const slTime = new Date(utcTime + 5.5 * 60 * 60 * 1000);

    const dayOfWeek = slTime.getDay();
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

    // if (!doctorDetails.workingHours.length) {
    //   return res.status(400).json({
    //     error: "Doctor is not available on this day",
    //   });
    // }
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
      include: {
        patient: {
          select: {
            email: true,
            name: true,
          },
        },
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
    });

    //////////////////////////////////////

    

    const time = new Date(newAppointment.time);
    const scheduledUTC = new Date(time.getTime() - 20 * 60 * 1000);

    let emailSent = false;

    cron.schedule("* * * * *", () => {
      const now = new Date();

      const match =
        now.getUTCFullYear() === scheduledUTC.getUTCFullYear() &&
        now.getUTCMonth() === scheduledUTC.getUTCMonth() &&
        now.getUTCDate() === scheduledUTC.getUTCDate() &&
        now.getUTCHours() === scheduledUTC.getUTCHours() &&
        now.getUTCMinutes() === scheduledUTC.getUTCMinutes();

      if (match && !emailSent) {
        console.log("⏰ Time matched! Sending email...");
const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #3a99b7; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">Appointment Reminder</h1>
    </div>
    <div style="padding: 20px; border: 1px solid #eee;">
      <p style="font-size: 16px; color: #333;">Dear ${newAppointment.patient.name},</p>
      <p style="font-size: 16px; line-height: 1.5; color: #444;">
        This is a reminder for your upcoming appointment today.
      </p>
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #3a99b7; margin-top: 0;">Appointment Details:</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 10px;">🗓️ Date: ${newAppointment.date.toLocaleDateString()}</li>
          <li style="margin-bottom: 10px;">⏰ Time: ${newAppointment.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</li>
          <li style="margin-bottom: 10px;">👨‍⚕️ Doctor: Dr. ${newAppointment.doctor.name}</li>
          <li style="margin-bottom: 10px;">📍 Location: ${newAppointment.doctor.doctorBookingDetails.room}</li>
        </ul>
      </div>
      <p style="font-size: 14px; color: #666; border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;">
        Please arrive 5 minutes before your scheduled time.
      </p>
    </div>
    <div style="background-color: #f8f9fa; padding: 15px; text-align: center;">
      <p style="color: #666; margin: 0; font-size: 12px;">
        If you need to reschedule, please contact us as soon as possible.
      </p>
    </div>
  </div>
`;


const textContent = `
          Dear Venuja,

          This is a reminder for your upcoming appointment today.

          Appointment Details:
          - Date: ${scheduledUTC.toLocaleDateString()}
          - Time: 9:00 AM - 9:30 AM
          - Doctor: Dr. Smith
          - Location: Room 205

          Please arrive 5 minutes before your scheduled time.

          If you need to reschedule, please contact us as soon as possible.
        `;



        sendEmail(
          newAppointment.patient.email,
          "Your Appointment Today",
          textContent,
          htmlContent
        );

        emailSent = true;
      }
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
    const nowUTC = new Date();
    const sriLankaOffsetInMs = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds

    // Set the time to midnight in SLT
    const slMidnight = new Date(nowUTC.getTime() + sriLankaOffsetInMs);
    slMidnight.setHours(0, 0, 0, 0);
    const today = await prisma.appointment.findMany({
      where: {
        patientId: req.user.id,
        date: {
          gte: slMidnight,
        },

        status: "Scheduled",
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
      const nowUTC = new Date();
      const sriLankaOffsetInMs = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds

      // Set the time to midnight in SLT
      const slMidnight = new Date(nowUTC.getTime() + sriLankaOffsetInMs);
      slMidnight.setHours(0, 0, 0, 0);

    const nextAppointment = await prisma.appointment.findMany({
      take: 2,
      where: {
        patientId: req.user.id,
        status: "Scheduled",
        date: {
          gte: slMidnight,
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
