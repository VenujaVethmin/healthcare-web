import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text , html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "venujavethmincoding@gmail.com",
      pass: "wlhs xriz ikim hefd", // Use your actual app password
    },
  });

  const mailOptions = {
    from: "venujavethmincoding@gmail.com",
    to: to,
    subject: subject,
    text: text,
    html: html
  };

  const info = await transporter.sendMail(mailOptions);

  return info;
};
