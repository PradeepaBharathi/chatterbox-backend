import express from "express";
import { addMessage, getAllMesssage } from "../Controllers/MessagesControllers.js";
const router = express.Router();

router.post("/addmsg", addMessage);
router.post("/getmsg", getAllMesssage);

export default router;
