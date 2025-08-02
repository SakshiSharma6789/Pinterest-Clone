import express from "express"

import { getUserBoards } from "../controllers/Board.controller.js";


const router  = express.Router();

router.get("/:userId" , getUserBoards)
export default router;