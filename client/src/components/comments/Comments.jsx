

import "./Comments.css"

import { useQuery } from "@tanstack/react-query";
import apiRequest from "../../utils/apiRequest";
import Comment from "./comment.jsx";
import CommentForm from "./commentForm.jsx";



function Comments({id}) {
 


const {isPending , error , data} = useQuery({
    queryKey: ["comments" , id],
    queryFn: ()=>apiRequest.get(`/comments/${id}`).then((res)=>res.data)
  });
  if(isPending) return "Loading...";
  if(error) return "An error has occurred: " + error.message;

console.log(data);



  return (
    <div className='comments'>
      <div className="commentList">
        <span className='commentCount'>{data.length ===0? "No comments" : data.length + "comments"}</span>
        {data.map((comment)=>(
          <Comment key={comment._id} comment={comment} pinId={id}/>
             ))}
      

       
      </div>
      <CommentForm id = {id}/>
    </div>
  )
}

export default Comments
