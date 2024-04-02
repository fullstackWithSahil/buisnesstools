import nodemailer from "nodemailer";
 
type emailType = {
  text?: string
  from?: string;
  to?: string;
  subject: string;
  html?: string;
}

async function sendMail(props: emailType) {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: "fullstackwithsahil@gmail.com",
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const from = props.from?props.from:"fullstackwithsahil@gmail.com";
  const to = props.to?props.to:"nayaksahil1145@gmail.com";

  const info = await transporter.sendMail({
    from: from, // sender address
    to: to, // list of receivers
    subject: props.subject, // Subject line
    text: props.text, // plain text body
    html: props.html // html body
  });
}

export default sendMail;
