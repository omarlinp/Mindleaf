import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, "../../data/patients-appointments.json");

const patientFields = [
  "name",
  "dob",
  "gender",
  "phone",
  "email",
  "referral",
  "address",
  "emergency",
  "concern",
  "notes",
];

const appointmentFields = [
  "pid",
  "date",
  "time",
  "type",
  "mode",
  "duration",
  "status",
  "fee",
  "payment",
];

const value = (input) => String(input ?? "").trim();

function nextId(prefix, records) {
  const ids = new Set(records.map((record) => record.id));
  let id;
  do {
    id = `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  } while (ids.has(id));
  return id;
}

export function readData() {
  return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

export function writeData(data) {
  fs.writeFileSync(dataFile, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  return data;
}

function updateData(mutator) {
  const data = readData();
  const result = mutator(data);
  writeData(data);
  return result;
}

function pickFields(input, fields) {
  return Object.fromEntries(
    fields.map((field) => [field, value(input[field])]),
  );
}

export function getPatients() {
  return readData().patients;
}

export function getPatient(id) {
  return getPatients().find((patient) => patient.id === id) || null;
}

export function createPatient(input) {
  return updateData((data) => {
    const patient = {
      id: nextId("p", data.patients),
      ...pickFields(input, patientFields),
    };
    data.patients.push(patient);
    return patient;
  });
}

export function updatePatient(id, input) {
  return updateData((data) => {
    const index = data.patients.findIndex((patient) => patient.id === id);
    if (index === -1) return null;
    data.patients[index] = {
      ...data.patients[index],
      ...pickFields(input, patientFields),
      id,
    };
    return data.patients[index];
  });
}

export function deletePatient(id) {
  return updateData((data) => {
    const patient = data.patients.find((item) => item.id === id);
    if (!patient) return null;
    data.patients = data.patients.filter((item) => item.id !== id);
    data.appointments = data.appointments.filter(
      (appointment) => appointment.pid !== id,
    );
    return patient;
  });
}

export function getAppointments() {
  return readData().appointments;
}

export function getAppointment(id) {
  return getAppointments().find((appointment) => appointment.id === id) || null;
}

export function createAppointment(input) {
  return updateData((data) => {
    const appointment = {
      id: nextId("a", data.appointments),
      ...pickFields(input, appointmentFields),
      fee: Number(input.fee) || 0,
    };
    if (appointment.payment === "Paid")
      appointment.paidOn = new Date().toISOString().slice(0, 10);
    data.appointments.push(appointment);
    return appointment;
  });
}

export function updateAppointment(id, input) {
  return updateData((data) => {
    const index = data.appointments.findIndex(
      (appointment) => appointment.id === id,
    );
    if (index === -1) return null;
    const previous = data.appointments[index];
    const appointment = {
      ...previous,
      ...pickFields(input, appointmentFields),
      id,
      fee: Number(input.fee) || 0,
    };
    if (appointment.payment === "Paid") {
      appointment.paidOn =
        previous.paidOn || new Date().toISOString().slice(0, 10);
    } else {
      delete appointment.paidOn;
    }
    data.appointments[index] = appointment;
    return appointment;
  });
}

export function deleteAppointment(id) {
  return updateData((data) => {
    const appointment = data.appointments.find((item) => item.id === id);
    if (!appointment) return null;
    data.appointments = data.appointments.filter((item) => item.id !== id);
    return appointment;
  });
}

export function updateAppointmentPayment(id, payment) {
  const appointment = getAppointment(id);
  if (!appointment) return null;
  return updateAppointment(id, { ...appointment, payment });
}

export function updateAppointmentNotes(id, input, markCompleted = false) {
  return updateData((data) => {
    const appointment = data.appointments.find((item) => item.id === id);
    if (!appointment) return null;
    appointment.notes = {
      ...(appointment.notes || {}),
      mood: value(input.mood),
      risk: value(input.risk),
      summary: value(input.summary),
      interventions: value(input.interventions),
      progress: value(input.progress),
      plan: value(input.plan),
      savedAt: new Date().toISOString(),
    };
    if (markCompleted) appointment.status = "Completed";
    return appointment;
  });
}
