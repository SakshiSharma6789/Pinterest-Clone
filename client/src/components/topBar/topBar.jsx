import React from 'react'
import './topBar.css'
import UserButton from '../userButton/userButton' 
import Image from '../Image/Image'
import { useNavigate } from 'react-router'
function TopBar() {

  const navigate = useNavigate()
  const handleSubmit = (e)=>{
    e.preventDefault();

    navigate(`/search?search=${e.target[0].value}`)

  }
  return (
    <div className='topBar'>
      {/* search bar */}
      <form onSubmit={handleSubmit} className='search'>
        <Image path='/general/search.svg' alt=''/>
        <input type='text' placeholder='Search'/>
     
       </form>

      <UserButton/>
     
    </div>
  )
}

export default TopBar
