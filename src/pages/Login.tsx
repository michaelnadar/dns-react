import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {Link, useNavigate} from "react-router-dom";

export const Login = () => {
   const navigate = useNavigate();
    const [username,setUsername] =useState("");
    const [password,setPassword] =useState("");
    const handleClick = async (e)=>{
        e.preventDefault();
        try {
            const result = await axios.post('https://dns-manager-tan.vercel.app/login',{
              username,password
            });
            if(result.status === 200){
              localStorage.setItem("dns",result.data.accessToken)
             console.log(result.data.accessToken);
                navigate('/dashboard')
            }
            
        } catch (error) {
          console.log(error)
            alert(error.message)
        }
    }
    useEffect(()=>
    {
      if(localStorage.getItem('dns')){
        navigate('/dashboard')
      }
    }
    ,[]);
  return (
    <div  style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <input style={{ padding: 10, marginBottom: 20 }} name="username" type='text' onChange={e=>setUsername(e.target.value) } placeholder='Username' />
        <input name="password" type='password' style={{ padding: 10, marginBottom: 20 }} onChange={e=>setPassword(e.target.value)} placeholder='Password' />
        <button style={{ padding: 10, width:100 }} onClick={handleClick}>LOGIN</button>
    </div>
  )
}