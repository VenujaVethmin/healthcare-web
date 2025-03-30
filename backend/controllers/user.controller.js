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
      },
    });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      where: { role: "DOCTOR" },
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
    const doctorId = req.params.id;
    const doctor = await prisma.doctorBookingDetails.findUnique({
      where: {
        doctorId: doctorId,
      },
      include: {
        workingHours: true,
        doctor: true,
      },
    });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json(doctor);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////

// export const createAppointment = async (
//   doctorId,
//   patientId,
//   date,
//   consultationFee
// ) => {
//   try {
//     // Convert date to a Date object if it's passed as a string
//     const dateObj = new Date(date);

//     // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
//     const dayOfWeek = dateObj.getDay();

//     // Convert the dayOfWeek to a readable format
//     const daysOfWeek = [
//       "SUNDAY",
//       "MONDAY",
//       "TUESDAY",
//       "WEDNESDAY",
//       "THURSDAY",
//       "FRIDAY",
//       "SATURDAY",
//     ];
//     const day = daysOfWeek[dayOfWeek];

//     // Find the working hours for the doctor on that specific day
//     const doctorDetails = await prisma.doctorBookingDetails.findUnique({
//       where: { doctorId: doctorId },
//       include: {
//         workingHours: {
//           where: {
//             day: day, // Use the day of the week
//           },
//         },
//       },
//     });

//     if (!doctorDetails || doctorDetails.workingHours.length === 0) {
//       throw new Error("No working hours available for the doctor on this day.");
//     }

//     // Get the start time for the doctor on that day (assuming there's only one working hour entry)
//     const startTimeString = doctorDetails.workingHours[0].startTime; // "HH:mm" format

//     // Combine the start time with the current date (use today's date but with the start time)
//     const [hours, minutes] = startTimeString.split(":").map(Number);
//     const startTimeDate = new Date(dateObj); // Start with the current date
//     startTimeDate.setHours(hours); // Set the hours
//     startTimeDate.setMinutes(minutes); // Set the minutes

//     // Now, you have the complete Date object with the start time
//     console.log("Appointment Start Time:", startTimeDate);

//     // Proceed with creating the appointment using the extracted startTime
//     const appointment = await prisma.appointment.create({
//       data: {
//         doctorId: doctorId,
//         patientId: patientId,
//         date: date,
//         startTime: startTimeDate,
//         consultationFee: consultationFee,
//       },
//     });

//     return appointment;
//   } catch (error) {
//     console.error("Error creating appointment:", error);
//     throw new Error("Failed to create appointment.");
//   }
// };
