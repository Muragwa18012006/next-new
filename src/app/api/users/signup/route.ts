import connect from "@/dbConfig/dbConfig"
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import { sendEmail } from "@/helpers/mailer"

connect()

export const POST = async(request: NextRequest) => {
    try {
        const reqBody = await request.json()
        const {username, email, password} = reqBody
        //check if user exist
        const user = await User.findOne({email})
        if(user) {
            return NextResponse.json({error: "user already exist"}, {status: 400})
        }
        //hash password
        const hashedPassword = await bcryptjs.hash(password, 10)
        //send data to database && create a new user
        const newUser = new User({username, email, password:hashedPassword})
      const savedUser = await newUser.save()
      //send email verification
      await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})

      return NextResponse.json({
        message: "User created",
        success: true,
        savedUser
      })

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}
