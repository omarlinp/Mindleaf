if (!Auth.current()) {
  location.replace("login.html");
  throw new Error("Not logged in");
}
const USER = Auth.current(),
  P = `pms_${USER.id}_`;
const DB = {
  get(k) {
    try {
      return JSON.parse(localStorage.getItem(P + k)) || [];
    } catch (e) {
      return [];
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(P + k, JSON.stringify(v));
    } catch (e) {
      alert("Could not save data: browser storage is unavailable.");
    }
  },
  id() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  },
};
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const today = () =>
  new Date(Date.now() - new Date().getTimezoneOffset() * 6e4)
    .toISOString()
    .slice(0, 10);
const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return new Date(d.getTime() - d.getTimezoneOffset() * 6e4)
    .toISOString()
    .slice(0, 10);
};
const age = (dob) => {
  if (!dob) return "";
  const b = new Date(dob),
    n = new Date();
  let a = n.getFullYear() - b.getFullYear();
  if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) a--;
  return a;
};
const fmtDate = (d) =>
  d
    ? new Date(d + "T00:00").toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";
const badge = {
  Scheduled: "primary",
  Completed: "success",
  Cancelled: "secondary",
};
const pname = (id) =>
  (DB.get("patients").find((p) => p.id === id) || { name: "Deleted patient" })
    .name;
const CURRENCY = "$"; // change to RD$, €, etc.
const money = (n) =>
  CURRENCY +
  Number(n || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const qs = new URLSearchParams(location.search);
const TYPES = [
  "Initial assessment",
  "Individual therapy",
  "Couples therapy",
  "Family therapy",
  "Follow-up",
];

(function seedDemo() {
  if (!USER.demo || localStorage.getItem(P + "seeded")) return;
  const p = [
    {
      id: "p1",
      name: "Maria Santos",
      dob: "1984-03-12",
      gender: "Female",
      phone: "809-555-0142",
      email: "maria@example.com",
      address: "Calle El Sol 14",
      emergency: "Luis Santos, 809-555-0150",
      referral: "Family doctor",
      concern: "Work-related anxiety and sleep difficulty",
      notes: "Prefers morning sessions.",
    },
    {
      id: "p2",
      name: "Juan Pérez",
      dob: "1971-11-02",
      gender: "Male",
      phone: "809-555-0178",
      email: "juan@example.com",
      address: "Av. Duarte 220",
      emergency: "Rosa Pérez, 809-555-0181",
      referral: "Self-referred",
      concern: "Grief after the loss of a parent",
      notes: "",
    },
    {
      id: "p3",
      name: "Ana Rodríguez",
      dob: "2012-07-25",
      gender: "Female",
      phone: "809-555-0199",
      email: "",
      address: "Calle Mella 5",
      emergency: "Carmen Rodríguez (mother), 809-555-0199",
      referral: "School counselor",
      concern: "School stress and social withdrawal",
      notes: "Minor: guardian consent on file.",
    },
  ];
  const a = [
    {
      id: "a1",
      pid: "p1",
      date: addDays(-14),
      time: "09:30",
      duration: "50",
      type: "Initial assessment",
      mode: "In person",
      status: "Completed",
      fee: 80,
      payment: "Paid",
      paidOn: addDays(-14),
      notes: {
        mood: "Anxious",
        summary:
          "Intake interview. Client described persistent worry about work deadlines and trouble falling asleep for the past six months.",
        interventions: "Psychoeducation about anxiety; sleep history review.",
        progress: "Engaged and open. Goals set: reduce worry, improve sleep.",
        risk: "No concerns noted",
        plan: "Start a sleep diary. Begin CBT-based sessions weekly.",
      },
    },
    {
      id: "a2",
      pid: "p1",
      date: addDays(-7),
      time: "09:30",
      duration: "50",
      type: "Individual therapy",
      mode: "In person",
      status: "Completed",
      fee: 80,
      payment: "Unpaid",
      notes: {
        mood: "Neutral",
        summary:
          "Reviewed sleep diary. Identified bedtime rumination as main trigger.",
        interventions: "Cognitive restructuring; worry-time technique.",
        progress: "Slightly improved sleep (about 2 more hours on average).",
        risk: "No concerns noted",
        plan: "Practice worry-time daily. Review next session.",
      },
    },
    {
      id: "a3",
      pid: "p1",
      date: today(),
      time: "09:30",
      duration: "50",
      type: "Individual therapy",
      mode: "Video",
      status: "Scheduled",
      fee: 80,
      payment: "Unpaid",
    },
    {
      id: "a4",
      pid: "p2",
      date: addDays(2),
      time: "11:00",
      duration: "50",
      type: "Individual therapy",
      mode: "In person",
      status: "Scheduled",
      fee: 80,
      payment: "Unpaid",
    },
  ];
  DB.set("patients", p);
  DB.set("appts", a);
  localStorage.setItem(P + "seeded", "1");
})();

(function nav() {
  const page = location.pathname.split("/").pop() || "dashboard.html";
  const l = [
    ["dashboard.html", "Dashboard", "speedometer2"],
    ["patients.html", "Patients", "people"],
    ["appointments.html", "Appointments", "calendar-check"],
  ];
  $("nav").innerHTML =
    `<nav class="navbar navbar-expand-md topbar navbar-dark"><div class="container">
  <a class="navbar-brand fw-bold" href="dashboard.html"><img src="img/logo-nav.svg" width="30" height="30" class="me-2" alt="">Mindleaf</a>
  <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#m" aria-label="Menu"><span class="navbar-toggler-icon"></span></button>
  <div class="collapse navbar-collapse" id="m"><ul class="navbar-nav ms-auto align-items-md-center">${l.map((x) => `<li class="nav-item"><a class="nav-link ${page === x[0] ? "active" : ""}" href="${x[0]}"><i class="bi bi-${x[2]} me-1"></i>${x[1]}</a></li>`).join("")}
  <li class="nav-item dropdown"><a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" role="button"><i class="bi bi-person-circle me-1"></i>${esc(USER.name)}</a>
  <ul class="dropdown-menu dropdown-menu-end"><li class="dropdown-item-text small text-muted">${esc(USER.email)}<br>${esc(USER.plan)} plan</li><li><hr class="dropdown-divider"></li><li><button class="dropdown-item" onclick="Auth.logout()"><i class="bi bi-box-arrow-right me-2"></i>Log out</button></li></ul></li></ul></div></div></nav>`;
})();
