import React from 'react'
import mongoose from "mongoose"

const connect = async() => {
    try {
        mongoose.connect(process.env.MONGO_URL!)
        const connection = mongoose.connection
        connection.on("connected", () => {
            console.log("MongoDB connected successfully ")
        })
        connection.on("error", (err) => {
            console.log("mongoDB error is: " + err)
            process.exit()
        })
    } catch (error) {
        console.log("something went wrong")
        console.log(error)
    }
}

export default connect
