import connect from "@/dbConfig/dbConfig"
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

connect()

export const POST = async(request: NextRequest) => {
    try {
        const reqBody = await request.json()
        const {email, password} = reqBody
        //check if user exist
        const user = await User.findOne({email})
        if(!user) {
            return NextResponse.json({error: 'user do not exist'}, {status: 400})
        }
        //check if password match
        const validPassword = await bcryptjs.compare(password, user.password)
        if(!validPassword){
            return NextResponse.json({error: "Invalid Password"}, {status: 400})
        }
        //create token data
        const tokenData = {
            id:user._id,
            username: user.username,
            email: user.email
        }
        //create token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1h"})

        const response = NextResponse.json({
            message: "login successfully",
            success: true
        })
        response.cookies.set("token", token, {httpOnly: true})
        return response
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}