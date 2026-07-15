// import transporter from './email.js';

//   const sendMail =(async (email, subject, Content) => {
//   const emailInfo = {
//     from: {
//         name:'Oloyede Tantoluwa Emmanuel',
//         email:process.env.NODEMAILER_USER
//     },
//     to: email.trim().toLowerCase(),
//     subject: subject,
//     text: Content,
   
//   };
// try{
//     await transporter.sendMail(emailInfo)
//     console.log(`Email successfully sent to ${email}`)
// }catch(error){
//     console.log('Error occured while sending email');
// };

// });
// export default sendMail;




// sendMail.js
import transporter from "./email2.js";

const sendMail = async (email, subject, content) => {
  const emailInfo = {
    from: `"Oloyede Tantoluwa Emmanuel" <${process.env.NODEMAILER_USER}>`,
    to: email.trim().toLowerCase(),
    subject,
    text: content,
  };

  try {
    await transporter.sendMail(emailInfo);
    console.log(`Email successfully sent to ${email}`);
  } catch (error) {
    console.log("Error occurred while sending email:", error.message);
    throw error;
  }
};

export default sendMail;