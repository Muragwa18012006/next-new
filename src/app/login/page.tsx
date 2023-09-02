"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from "axios"
import { toast } from 'react-hot-toast'

const LoginPage = () => {
  const router = useRouter()
  const [user, setUser] = useState({
    email: "",
    password: "",
  })
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const onLogin = async () => {
    try {
      const response = await axios.post("/api/users/login", user)
      console.log(response.data)
      toast.success("logged in successfully")
      router.push("/profile")
    } catch (error: any) {
      toast.error(error.message)
    } finally{
      setLoading(false)
    }
  }
  useEffect(() => {
    if(user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false)
    } else{
      setButtonDisabled(true)
    }
  }, [user])
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2 '>
      <h1>{loading ? "processing..." : "Login"}</h1>
      <hr />
<label htmlFor="email">email</label>
      <input className='p-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black'
       type="text" value={user.email} id="email" onChange={(e)=> setUser(
        {...user, email: e.target.value}
      )} placeholder='email' />

<label htmlFor="password">password</label>
      <input className='p-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black'
       type="password" value={user.password} id="password" onChange={(e)=> setUser(
        {...user, password: e.target.value}
      )} placeholder='password' />
      <button onClick={onLogin}
       className='p-2 border border-gray-300
      rounded-lg mb-4 focus:outline-none focus:border-gray
      -600'>{buttonDisabled ? "No login" : "Login"}</button>
      <Link href='/signup'>Visit Signup page</Link>
    </div>
  )
}

export default LoginPage