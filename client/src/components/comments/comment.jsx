import React from 'react'
import Image from '../Image/Image';
import { format } from 'timeago.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../../utils/apiRequest';






function Comment({comment , pinId}) {


const deleteComment = async (id)=>{
  const res = await apiRequest.delete(`/comments/${id}`);
  return res.data;
}

 const queryClient = useQueryClient()

const mutation = useMutation({
  mutationFn : deleteComment,
  onSuccess : ()=>{
    queryClient.invalidateQueries({queryKey: ["comments" , pinId]});
  }
})
const handleDelete = (id)=>{

  mutation.mutate(id);
}



   



  return (
    
       <div 
       style=
       {{display: "flex", 
        alignItems: "flex-start", 
        justifyContent: "space-between", 
        
        width: "100%"
       }} 
       className="comment"
       
       key={comment._id}
       
       >

      <div style={{ display: "flex" , gap:"10px", flex: 1 }}>
      <Image path ={comment.user.img || "/general/noAvatar.png"} alt=""/>
      
      <div className="commentContent">
        <span className="commentusername">{comment.user.displayName}</span>
        <p className="commentText">
          {comment.description}
        </p>
    <span className="commentTime">{format(comment.createdAt.trim())}</span>
      </div>
      </div>
      <div onClick={()=>handleDelete(comment._id)} 
      style={{ cursor: "pointer" }}>

       <Image
         alt="" path="/general/delete.svg"
      />
      </div>
      
      </div> 
       
  );
};

export default Comment
