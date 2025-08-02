import './AuthPage.css'
import Image from '../../components/Image/Image'
import { useState } from 'react'

import { useNavigate } from "react-router";
import apiRequest from "../../utils/apiRequest";
import UseAuthStore from '../../utils/authStore';

function AuthPage() {
  const [isRegister , setIsRegister] = useState(false);
  const [error , setError] = useState("")
 
  const navigate = useNavigate()


  const {setCurrentUser} =  UseAuthStore()

  const handleSubmit = async (e)=>{
       e.preventDefault()
       const formData = new FormData(e.target)
       const data = Object.fromEntries(formData)

      try{

       const res = await apiRequest.post(`/users/auth/${isRegister ? "register" : "login"}` , data)
 // console.log(res.data);


 //before navigatong set our new user
 setCurrentUser(res.data); // also use this in userButton.jsx
 

      navigate("/")



 } catch(err){
  setError(err.response.data.message)
 }
}
  
  return (
    <div className='authPage'>

      <div className="authContainer">
        <div className="above">
        <Image path='/general/logo.png' alt="" />
        <h1>{isRegister ?"Create an account" :"Login to Pinterset" }</h1>
        </div>

        {isRegister ? (
        <form key="register" onSubmit={handleSubmit}>
          <div className="formGroup">
          <label htmlFor='userName'>username</label>
          <input
          type="userName"
          placeholder='username'
          id='userName'
          required name='userName'
          />
          </div>
          <div className="formGroup">
           <label htmlFor="displayName">Name</label>
              <input
                type="displayName"
                placeholder="Name"
                required
                name="displayName"
                id="displayName"
              />
              </div>
            <div className="formGroup">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Email"
                required
                name="email"
                id="email"
              />
            </div>
            <div className="formGroup">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Password"
                required
                name="password"
                id="password"
              />
            </div>
            <button type="submit">Register</button>
            <p onClick={() => setIsRegister(false)}>
              Do you have an account? <b>Login</b>
            </p>
            {error && <p className="error">{error}</p>}
          </form>
        ) : (
          <form key="loginForm" onSubmit={handleSubmit}>
            <div className="formGroup">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Email"
                required
                name="email"
                id="email"
              />
            </div>
            <div className="formGroup">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Password"
                required
                name="password"
                id="password"
              />
            </div>
            <button type="submit">Login</button>
            <p onClick={() => setIsRegister(true)}>
              Don&apos;t have an account? <b>Register</b>
            </p>
            {error && <p className="error">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};


            

export default AuthPage
