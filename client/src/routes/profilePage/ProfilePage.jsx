import React, { useState } from 'react'
import './ProfilePage.css'
import Image from '../../components/Image/Image'

import Gallery from '../../components/gallery/gallery'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import apiRequest from '../../utils/apiRequest'
import Boards from '../../components/boards/Boards'
import FollowButton from  "./followButton"

function ProfilePage() {
  const [type , setType] = useState("saved");
  const {userName} = useParams()
 // const [follow , setfollow] = useState["follow"];

  const {isPending , error , data} = useQuery({
  queryKey:["profile",userName],
  queryFn: () => apiRequest.get(`/users/${userName}`).then((res)=>res.data)
});

if (isPending) return "Loading...";

if(error) return "An error has occured: " + error.message;

if(!data) return "user not found!";

console.log(data);




  return (
    <div className='profilePage'>
      <Image  className='profileImage' w={100}
      h= {100} path={data.img || "/general/noAvatar.png"} alt="data.displayName"/>
      <h1 className='profileName'>{data.displayName}</h1>
      <span className='profileUsername'>@{data.userName}</span>
      <div className='followCounts'>{data.followerCounts} . {data.followingCounts}</div>
      <div  className='profileInteractions'>
        <Image path="/general/share.svg" alt=""/>
        <div className="profileButtons">
        <button>Message</button>
        <FollowButton isFollowing={data.isFollowing} userName={data.userName}/>
        </div>
        <Image path="/general/more.svg/"alt="" />
      </div>
      <div className="profileOptions">
        <span onClick={() =>setType("created")} className={type==="created" ? "active" : ""}>Created</span>
        <span onClick={() =>setType("saved")} className={type==="saved" ? "active" : ""}>Saved</span>

      </div>
      {type==="created" ? <Gallery userId={data._id}/> : <Boards userId={data._id}/>}
    </div>

  )
}

export default ProfilePage
