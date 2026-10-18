import {
  createAppointment,
  createPatient,
  deleteAppointment,
  deletePatient,
  getAppointment,
  getAppointments,
  getPatient,
  getPatients,
  updateAppointment,
  updateAppointmentNotes,
  updateAppointmentPayment,
  updatePatient,
} from "../models/demo.js";

const TYPES = [
  "Initial assessment",
  "Individual therapy",
  "Couples therapy",
  "Family therapy",
  "Follow-up",
];

const today = () => new Date().toISOString().slice(0, 10);
const dateLabel = (date) =>
  date
    ? new Date(`${date}T00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";
const fee = (appointment) => Number(appointment.fee) || 0;
const money = (amount) =>
  `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
const age = (dob) => {
  if (!dob) return "";
  const birth = new Date(`${dob}T00:00`);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  if (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate()))
    years--;
  return years;
};
const statusClass = {
  Scheduled: "primary",
  Completed: "success",
  Cancelled: "secondary",
};

function appointmentView(appointment, patientById) {
  return {
    ...appointment,
    patient: patientById.get(appointment.pid) || { name: "Deleted patient" },
    formattedDate: dateLabel(appointment.date),
    formattedPaidOn: appointment.paidOn ? dateLabel(appointment.paidOn) : "",
    formattedFee: money(fee(appointment)),
  };
}

export function renderDashboard(req, res) {
  const patients = getPatients();
  const appointments = getAppointments();
  const patientById = new Map(patients.map((patient) => [patient.id, patient]));
  const currentDay = today();
  const upcoming = appointments
    .filter(
      (appointment) =>
        appointment.status === "Scheduled" && appointment.date >= currentDay,
    )
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const active = appointments.filter(
    (appointment) => appointment.status !== "Cancelled",
  );
  const unpaid = active
    .filter((appointment) => appointment.payment !== "Paid")
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const paid = active
    .filter((appointment) => appointment.payment === "Paid")
    .sort((a, b) => (b.paidOn || b.date).localeCompare(a.paidOn || a.date));

  res.render("dashboard", {
    dashboard: {
      stats: {
        patients: patients.length,
        today: upcoming.filter((appointment) => appointment.date === currentDay)
          .length,
        upcoming: upcoming.length,
        completed: appointments.filter(
          (appointment) => appointment.status === "Completed",
        ).length,
      },
      finances: {
        unpaidTotal: money(
          unpaid.reduce((total, appointment) => total + fee(appointment), 0),
        ),
        unpaidCount: unpaid.length,
        paidTotal: money(
          paid.reduce((total, appointment) => total + fee(appointment), 0),
        ),
        paidCount: paid.length,
      },
      upcoming: upcoming
        .slice(0, 6)
        .map((appointment) => appointmentView(appointment, patientById)),
      recentPatients: patients
        .slice(-5)
        .reverse()
        .map((patient) => ({ ...patient, age: age(patient.dob) })),
      unpaid: unpaid.map((appointment) =>
        appointmentView(appointment, patientById),
      ),
      paid: paid.map((appointment) =>
        appointmentView(appointment, patientById),
      ),
    },
    statusClass,
  });
}

export function renderPatients(req, res) {
  const query = String(req.query.q || "")
    .trim()
    .toLowerCase();
  const appointments = getAppointments();
  const patients = getPatients()
    .filter((patient) =>
      [patient.name, patient.phone, patient.email, patient.concern]
        .join(" ")
        .toLowerCase()
        .includes(query),
    )
    .map((patient) => ({
      ...patient,
      age: age(patient.dob),
      appointmentCount: appointments.filter(
        (appointment) => appointment.pid === patient.id,
      ).length,
    }));

  res.render("patients", {
    patients,
    query: req.query.q || "",
    patientForm: null,
  });
}

export function renderPatientForm(req, res) {
  const patient = req.params.id ? getPatient(req.params.id) : null;
  if (req.params.id && !patient) return res.status(404).redirect("/patients");
  res.render("patients", {
    patients: getPatients().map((item) => ({
      ...item,
      age: age(item.dob),
      appointmentCount: getAppointments().filter((a) => a.pid === item.id)
        .length,
    })),
    query: "",
    patientForm: patient || { gender: "Female" },
  });
}

export function createPatientController(req, res) {
  const patient = createPatient(req.body);
  res.redirect(`/patient/${patient.id}`);
}

export function updatePatientController(req, res) {
  const patient = updatePatient(req.params.id, req.body);
  if (!patient) return res.status(404).redirect("/patients");
  res.redirect(`/patient/${patient.id}`);
}

export function deletePatientController(req, res) {
  deletePatient(req.params.id);
  res.redirect("/patients");
}

export function renderAppointments(req, res) {
  const status = String(req.query.status || "");
  const patients = getPatients();
  const patientById = new Map(patients.map((patient) => [patient.id, patient]));
  const appointments = getAppointments()
    .filter((appointment) => !status || appointment.status === status)
    .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`))
    .map((appointment) => appointmentView(appointment, patientById));

  res.render("appointments", {
    appointments,
    patients,
    status,
    types: TYPES,
    appointmentForm: null,
    statusClass,
  });
}

export function renderAppointmentForm(req, res) {
  const patients = getPatients();
  const appointment = req.params.id ? getAppointment(req.params.id) : null;
  if (req.params.id && !appointment)
    return res.status(404).redirect("/appointments");
  res.render("appointments", {
    appointments: getAppointments()
      .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`))
      .map((item) =>
        appointmentView(item, new Map(patients.map((p) => [p.id, p]))),
      ),
    patients,
    status: "",
    types: TYPES,
    appointmentForm: appointment || {
      pid: req.query.patient || "",
      date: today(),
      time: "",
      duration: "50",
      type: "Individual therapy",
      mode: "In person",
      status: "Scheduled",
      fee: "80",
      payment: "Unpaid",
    },
    statusClass,
  });
}

export function createAppointmentController(req, res) {
  const appointment = createAppointment(req.body);
  res.redirect(`/appointment/${appointment.id}`);
}

export function updateAppointmentController(req, res) {
  const appointment = updateAppointment(req.params.id, req.body);
  if (!appointment) return res.status(404).redirect("/appointments");
  res.redirect(`/appointment/${appointment.id}`);
}

export function deleteAppointmentController(req, res) {
  deleteAppointment(req.params.id);
  res.redirect("/appointments");
}

export function updatePaymentController(req, res) {
  updateAppointmentPayment(req.params.id, req.body.payment);
  res.redirect("/dashboard");
}

export function renderPatient(req, res) {
  const patient = getPatient(req.params.id);
  if (!patient) return res.status(404).render("patient", { patient: null });
  const patientById = new Map([[patient.id, patient]]);
  const appointments = getAppointments()
    .filter((appointment) => appointment.pid === patient.id)
    .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`))
    .map((appointment) => appointmentView(appointment, patientById));
  res.render("patient", {
    patient: { ...patient, age: age(patient.dob) },
    appointments,
    statusClass,
  });
}

export function renderAppointment(req, res) {
  const appointment = getAppointment(req.params.id);
  if (!appointment)
    return res.status(404).render("appointment", { appointment: null });
  const patient = getPatient(appointment.pid);
  res.render("appointment", {
    appointment: { ...appointment, formattedDate: dateLabel(appointment.date) },
    patient,
    statusClass,
  });
}

export function updateNotesController(req, res) {
  const appointment = updateAppointmentNotes(
    req.params.id,
    req.body,
    req.body.action === "complete",
  );
  if (!appointment) return res.status(404).redirect("/appointments");
  res.redirect(`/appointment/${appointment.id}`);
}
