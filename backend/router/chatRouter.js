import express from "express";
import {
  createChatRoom,
  sendChat,
  editChat,
  getChatRoomMessages,
  markChatRead,
  getUnreadChatsForUser,
  getPatientList
} from "../controller/chatController.js";
import { isPatientAuthanticated, isDoctorAuthanticated, isPatientOrDoctorAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/createRoom", isPatientAuthanticated, createChatRoom);
router.post("/send", isPatientOrDoctorAuthenticated, sendChat);
router.put("/edit/:id", isPatientAuthanticated, editChat);
router.get("/room/:chatRoomId", isPatientAuthanticated, getChatRoomMessages);
router.put("/read/:id", isPatientAuthanticated, markChatRead);
router.get("/unread/:userId", isPatientAuthanticated, getUnreadChatsForUser);
router.get("/patientlist", isDoctorAuthanticated, getPatientList);

export default router;
