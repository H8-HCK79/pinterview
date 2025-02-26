"use client";

import { useState } from "react";

export default function Login() {
  const [email,setEmail] =useState('')
  const [password,setPassword] =useState('')
  
  
  async function handleCredentialResponse(response: any) {


  }



  async function handleLogin() {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_UR}/api/login`,{
          method:"POST",
          headers: {
            'Content-Type':`application/json`
          },
          body:JSON.stringify({email,password})

        })

        const data = await response.json()
        if(!response.ok) {

        }
  }
  return <>
  <script src="https://accounts.google.com/gsi/client"></script>

  <div>login
    
  </div>;</>
}
