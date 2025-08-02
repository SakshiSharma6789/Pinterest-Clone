import express from "express"
import { getPostComments } from "../controllers/Comment.controller.js "
import { verifyToken } from "../middleware/verifyToken.js";
import  { addComment  , deleteComment} from "../controllers/comment.controller.js";


const router = express.Router();

router.get("/:postId" , getPostComments)

router.post("/" ,verifyToken, addComment)

router.delete("/:id" , verifyToken , deleteComment);

export default router;