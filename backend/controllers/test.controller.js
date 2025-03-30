import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const test = async (req, res) => {
  try {
    const { date, doctorId, patientId } = req.body;
    const dateObj = new Date(date);

    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
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

    // Find the working hours for the doctor on that specific day
    const doctorDetails = await prisma.doctorBookingDetails.findUnique({
      where: { doctorId: doctorId },
      select: {
        workingHours: {
          where: { day: day },
        },
        maxPatientsPerDay : true,
      },
    });

    const maxPatients = doctorDetails.maxPatientsPerDay;
    const todayAppoimentCont = await prisma.appointment.count({
      where: {
        doctorId: doctorId,
        date: dateObj,
      },
    });
    if (todayAppoimentCont >= maxPatients) {
      return res.status(500).json({ error: "Max patients reached for today." });
    }
   

    if (!doctorDetails || doctorDetails.workingHours.length === 0) {
      throw new Error("No working hours available for the doctor on this day.");
    }

    // Get the start time for the doctor on that day (assuming there's only one working hour entry)
    const startTimeString = doctorDetails.workingHours[0].startTime; // "HH:mm" format

    // Convert "HH:mm" to a DateTime object
    const [hours, minutes] = startTimeString.split(":").map(Number);
    const appointmentTime = new Date(dateObj);
    appointmentTime.setHours(hours, minutes, 0, 0); // Set hours and minutes

    const appoiments = await prisma.appointment.findMany({
      where: {
        doctorId: doctorId,
        date: dateObj,
      },
    });

    if (!appoiments) {
      // Create a new appointment with the corrected DateTime format
      const newAppointment = await prisma.appointment.create({
        data: {
          doctorId: doctorId,
          patientId: patientId,
          date: dateObj,
          time: appointmentTime, // Now in valid DateTime format
        },
      });

      return res.json({ newAppointment });
    }

    const lastApointmentTime = await prisma.appointment.findFirst({
      where: {
        doctorId: doctorId,
        date: dateObj,
      },
      select: {
        time: true,
        
      },
      orderBy: {
        createdAt: "desc",
      },
    });


    if (!doctorDetails.maxPatientsPerDay) {
      return res.status(500).json({ error: "No max patients per day found." });
    }
    // Convert maxPatientsPerDay to a number
    const maxPatientsPerDayInt = parseInt(doctorDetails.maxPatientsPerDay, 10);

    if (lastApointmentTime) {
      const lastAppointmentDate = new Date(lastApointmentTime.time);
      lastAppointmentDate.setMinutes(
        lastAppointmentDate.getMinutes() + maxPatientsPerDayInt
      );
      const lastAppoimentTimeString = lastAppointmentDate.toISOString();


     const newAppointment = await prisma.appointment.create({
       data: {
         doctorId: doctorId,
         patientId: patientId,
         date: dateObj,
         time: lastAppoimentTimeString, // Now in valid DateTime format
       },
     });

      return res.json({ newAppointment });
    } else {
      throw new Error("No previous appointments found.");
    }
   
  
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
