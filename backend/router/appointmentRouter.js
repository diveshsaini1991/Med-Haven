import express from "express";
import { deleteAppointment, getAllAppointments, getMyAppointments, getPatientAppointments, postAppointment, updateAppointmentStatus, updatePatientAppointment } from "../controller/appointmentController.js";
import { isAdminAuthanticated, isDoctorAuthanticated, isPatientAuthanticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isPatientAuthanticated, postAppointment);
router.get("/getall", isAdminAuthanticated, getAllAppointments);
router.get("/get", isDoctorAuthanticated, getMyAppointments);
router.put("/update/:id", isAdminAuthanticated, updateAppointmentStatus);
router.delete("/delete/:id", isAdminAuthanticated, deleteAppointment);
router.put("/doctor/update/:id", isDoctorAuthanticated, updateAppointmentStatus);
router.delete("/doctor/delete/:id", isDoctorAuthanticated, deleteAppointment);
router.get("/myappointments", isPatientAuthanticated, getPatientAppointments);
router.put("/patient/update/:id", isPatientAuthanticated, updatePatientAppointment);



export default router;