import express from "express";
import { deleteAppointment, getAllAppointments, postAppointment, updateAppointmentStatus } from "../controller/appointmentController.js";
import { isAdminAuthanticated, isPatientAuthanticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isPatientAuthanticated, postAppointment);
router.get("/getall", isAdminAuthanticated, getAllAppointments);
router.put("/update/:id", isAdminAuthanticated, updateAppointmentStatus);
router.delete("/delete/:id", isAdminAuthanticated, deleteAppointment);

export default router;