// // import AWS from "aws-sdk";
// // import nodemailer from "nodemailer";
// // import env from "dotenv";
// // env.config()

// // AWS.config.update({
// //   accessKeyId: process.env.SES_ACCESS_KEY,
// //   secretAccessKey: process.env.SES_SECRET_KEY,
// //   region: process.env.REGION,
// // });

// // AWS.config.getCredentials((err) => {
// //   if (err) {
// //     console.log(err);
// //   }
// // });

// // const SES = new AWS.SES({ apiVersion: "2010-12-01" });

// // const transporter = nodemailer.createTransport({
// //   SES: SES,
// // });

// // type emailType = {
// //   text?: string;
// //   from?: string;
// //   to?: string;
// //   subject: string;
// //   html?: string;
// // };

// // async function sendMail({
// //   subject,
// //   text,
// //   to = "buisness@buisnesstoolsonline.com",
// //   html,
// //   from = "fullstackwithsahil@gmail.com",
// // }: emailType) {
// //   try {
// //     const response = await transporter.sendMail({
// //       from,
// //       subject,
// //       to,
// //       html,
// //       text,
// //     });
// //     return response;
// //   } catch (error) {
// //     console.log("error sending email in sendMail function", error);
// //   }
// // }

// // export default sendMail;
// import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
// import env from "dotenv";
// env.config();

// const sesConfig = {
//   region: process.env.REGION,
//   credentials: {
//     accessKeyId: process.env.SES_ACCESS_KEY,
//     secretAccessKey: process.env.SES_SECRET_KEY,
//   },
// };

// const sesClient = new SESClient(sesConfig);

// type emailType = {
//   text?: string;
//   from?: string;
//   to?: string;
//   subject: string;
//   html?: string;
// };

// async function sendMail({
//   subject,
//   text,
//   to = "buisness@buisnesstoolsonline.com",
//   html,
//   from = "fullstackwithsahil@gmail.com",
// }: emailType) {
//   try {
//     const emailParams = {
//       Destination: {
//         ToAddresses: [to],
//       },
//       Message: {
//         Body: {
//           Html: {
//             Charset: "UTF-8",
//             Data: html,
//           },
//           Text: {
//             Charset: "UTF-8",
//             Data: text,
//           },
//         },
//         Subject: {
//           Charset: "UTF-8",
//           Data: subject,
//         },
//       },
//       Source: from,
//     };

//     const sendEmailCommand = new SendEmailCommand(emailParams);
//     await sesClient.send(sendEmailCommand);

//     return { message: "Email sent successfully" };
//   } catch (error) {
//     console.error("Error sending email:", error);
//     return { error: "Failed to send email" }; // Return error object for informative handling
//   }
// }

// export default sendMail;