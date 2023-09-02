import nodemailer from "nodemailer"
import User from "@/models/userModel"
import bcryptjs from 'bcryptjs'

export const sendEmail = async({email, emailType, userId} : any) => {
    try {
        //create a hashed token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10)
    //create a transporter
if(emailType === "VERIFY") {
    await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000})
} else if(emailType === 'RESET') {
    await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000})
    }
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "109ce46b6ff44a",
          pass: "d74c7da1e12b59"
        }
      });
      const mailOption = {
        from: 'oliveLTDCompany@gmail.com',
        to: email,
        subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
        html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?
        token=${hashedToken}">here</a> to ${ emailType === "VERIFY" ? "Verify your email" : "Reset your password"}</p>`
      }
      const mailresponse = await transport.sendMail(mailOption)
      return mailresponse
    } catch (error: any) {
        throw new Error(error.message)
    }
}



