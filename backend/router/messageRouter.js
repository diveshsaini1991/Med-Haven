import express from "express";
import { getAllMessages, sendMessage, getMyMessages } from "../controller/messageController.js";
import { isAdminAuthanticated ,isDoctorAuthanticated} from "../middlewares/auth.js";

const router = express.Router();

router.post("/send", sendMessage);
router.get("/getall", isAdminAuthanticated, getAllMessages);
router.get("/get",isDoctorAuthanticated,getMyMessages)

export default router;