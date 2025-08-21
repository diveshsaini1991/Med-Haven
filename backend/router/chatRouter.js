import express from "express";
import {
  createChatRoom,
  sendChat,
  editChat,
  getChatRoomMessages,
  markChatRead,
  getUnreadChatsForUser,
  getPatientList,
  uploadChatImage
} from "../controller/chatController.js";
import { isPatientOrDoctorAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/createRoom", isPatientOrDoctorAuthenticated, createChatRoom);
router.post("/send", isPatientOrDoctorAuthenticated, sendChat);
router.put("/edit/:id", isPatientOrDoctorAuthenticated, editChat);
router.get("/room/:chatRoomId", isPatientOrDoctorAuthenticated, getChatRoomMessages);
router.put("/read/:id", isPatientOrDoctorAuthenticated, markChatRead);
router.get("/unread/:userId", isPatientOrDoctorAuthenticated, getUnreadChatsForUser);
router.get("/patientlist", isPatientOrDoctorAuthenticated, getPatientList);
router.post("/uploadImage", isPatientOrDoctorAuthenticated, uploadChatImage);

export default router;
