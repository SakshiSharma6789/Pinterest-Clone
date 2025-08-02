import React from 'react'
import './PostPage.css'
import Image from '../../components/Image/Image'
import PostInteractions from '../../components/postInteractions/postInteractions'
import Comments from '../../components/comments/Comments'
import { Link, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import apiRequest from '../../utils/apiRequest'

function PostPage() {

  const {id} = useParams()

const {isPending , error , data} = useQuery({
  queryKey:["pin",id],
  queryFn: () => apiRequest.get(`/pins/${id}`).then((res)=>res.data)
});

if (isPending) return "Loading...";

if(error) return "An error has occured: " + error.message;

if(!data) return "pin not found!";

console.log(data);

  return (
    <div className='postpage'>
      <svg  height= "20"
        viewBox='0 0 24 24'
        width="20"
        style={{ cursor: "pointer" ,  width: "24px", height: "24px"  }}>
        <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M15.75 19.5L8.25 12l7.5-7.5"
  />
        
</svg>

      
      <div className="postContainer">
        <div className="postImg">
          <Image path = {data.media} alt="" w={736} />


        </div>
        <div className="postDetails">
          <PostInteractions postId = {id}/>
          {data?.user?( <Link to={`/${ data.user.userName}`} className='postUser'>
          <Image path={data.user.img || "/general/noAvatar.png" } />
           <span>{data.user.displayName}</span>
          </Link>): (
            <span>Loading user info...</span> 
          )}
         
          <Comments id={data._id}/>

        </div>
      </div>
      
    </div>
  )
}

export default PostPage
