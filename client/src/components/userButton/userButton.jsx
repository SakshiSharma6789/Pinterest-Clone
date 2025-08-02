import React, { useState } from 'react'
import './UserButton.css'
import Image from '../Image/Image';
import apiRequest from '../../utils/apiRequest';
import { useNavigate } from 'react-router';
import UseAuthStore from '../../utils/authStore';
import { Link } from 'react-router';

function UserButton() {

    //Temp
  //const currentUser = true;

  const {currentUser , removeCurrentUser} =  UseAuthStore()
  console.log(currentUser);

  const [open , setopen] = useState(false);

  const navigate = useNavigate()

  const handleLogout = async ()=>{
    try{
    await apiRequest.post("/users/auth/logout" ,{} );
    removeCurrentUser();
    navigate("/auth")
    } catch(err){
      console.log(err)
    }
  }
  return currentUser ? (
    <div className='userButton'>
      <Image path={currentUser.img || '/general/noAvatar.png'} alt='avatar'/>
      <div onClick={()=>setopen((prev)=>!prev)}>

      
      <Image
       
       
       path='/general/arrow.svg' alt='arrow' className='arrow'/>
       </div>
       {open && (
      <div className="userOptions">
        <Link to={`/profile${currentUser.userName}`} className="userOption">Profile</Link>
        <div className="userOption">Setting</div>
        <div className="userOption" onClick={handleLogout}>Logout</div>
      </div>
      )}
    </div>

  ) : (
    <Link to='/auth' className='loginLink'>
        Login/signup
    </Link>

  );
}

export default UserButton
