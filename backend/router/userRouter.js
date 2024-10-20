import express from "express";
import { addNewAdmin, addNewDoctor, getAllDoctors, getUserDetails, login, logoutAdmin, logoutDoctor, logoutPatient, patientRegister } from "../controller/userController.js";
import { isAdminAuthanticated, isDoctorAuthanticated, isPatientAuthanticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/patient/register", patientRegister);
router.post("/login", login);
router.post("/admin/addnew", isAdminAuthanticated, addNewAdmin);
router.get("/doctors", getAllDoctors);
router.get("/admin/me", isAdminAuthanticated, getUserDetails);
router.get("/patient/me", isPatientAuthanticated, getUserDetails);
router.get("/admin/logout", isAdminAuthanticated, logoutAdmin);
router.get("/patient/logout", isPatientAuthanticated, logoutPatient);
router.get("/doctor/logout", isDoctorAuthanticated, logoutDoctor);
router.post("/doctor/addnew", isAdminAuthanticated, addNewDoctor);

export default router;