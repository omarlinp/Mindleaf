import express from "express";
import {
  createAppointmentController,
  createPatientController,
  renderAppointment,
  renderAppointmentForm,
  renderAppointments,
  renderDashboard,
  renderPatient,
  renderPatientForm,
  renderPatients,
  updateAppointmentController,
  updateNotesController,
  updatePaymentController,
  updatePatientController,
  deleteAppointmentController as removeAppointmentController,
  deletePatientController as removePatientController,
} from "../controllers/demo.js";

const router = express.Router();

router.get("/", (req, res) => res.render("index"));
router.get("/login", (req, res) => res.render("login"));
router.get("/signup", (req, res) => res.render("signup"));

router.get("/dashboard", renderDashboard);
router.post("/appointments/:id/payment", updatePaymentController);

router.get("/patients", renderPatients);
router.get("/patients/new", renderPatientForm);
router.get("/patients/:id/edit", renderPatientForm);
router.post("/patients", createPatientController);
router.post("/patients/:id", updatePatientController);
router.post("/patients/:id/delete", removePatientController);
router.get("/patient/:id", renderPatient);

router.get("/appointments", renderAppointments);
router.get("/appointments/new", renderAppointmentForm);
router.get("/appointments/:id/edit", renderAppointmentForm);
router.post("/appointments", createAppointmentController);
router.post("/appointments/:id", updateAppointmentController);
router.post("/appointments/:id/delete", removeAppointmentController);
router.post("/appointments/:id/notes", updateNotesController);
router.get("/appointment/:id", renderAppointment);

export default router;
