const fee = (a) => Number(a.fee) || 0,
  sum = (l) => l.reduce((t, a) => t + fee(a), 0);
const card = (label, val, icon, color) =>
  `<div class="col-6 col-lg-3"><div class="card stat shadow-sm" style="border-left-color:${color}"><div class="card-body d-flex justify-content-between align-items-center"><div><div class="num">${val}</div><div class="text-muted">${label}</div></div><i class="bi bi-${icon} fs-2" style="color:${color}"></i></div></div></div>`;
const who = (a) =>
  `<a class="fw-semibold text-decoration-none" href="patient.html?id=${a.pid}">${esc(pname(a.pid))}</a>`;
const amt = (a) =>
  fee(a) ? money(fee(a)) : '<span class="text-muted small">No fee set</span>';
const empty = (m, l, h) =>
  `<li class="list-group-item text-muted py-4 text-center">${m} <a href="${h}">${l}</a></li>`;
function setPay(id, v) {
  DB.set(
    "appts",
    DB.get("appts").map((a) => {
      if (a.id !== id) return a;
      const r = { ...a, payment: v };
      if (v === "Paid") r.paidOn = today();
      else delete r.paidOn;
      return r;
    }),
  );
  render();
}
function render() {
  const ps = DB.get("patients"),
    all = DB.get("appts"),
    t = today();
  const up = all
    .filter((a) => a.status === "Scheduled" && a.date >= t)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  $("stats").innerHTML =
    card("Patients", ps.length, "people", "#0f766e") +
    card(
      "Today",
      up.filter((a) => a.date === t).length,
      "calendar-day",
      "#0f766e",
    ) +
    card("Upcoming", up.length, "calendar-event", "#0f766e") +
    card(
      "Completed",
      all.filter((a) => a.status === "Completed").length,
      "check2-circle",
      "#0f766e",
    );
  $("upcoming").innerHTML =
    up
      .slice(0, 6)
      .map(
        (a) =>
          `<li class="list-group-item d-flex justify-content-between"><div><a class="fw-semibold text-decoration-none" href="appointment.html?id=${a.id}">${esc(pname(a.pid))}</a><div class="small text-muted">${esc(a.type)} · ${esc(a.mode)}</div></div><div class="text-end small">${fmtDate(a.date)}<br>${esc(a.time)}</div></li>`,
      )
      .join("") ||
    empty("Nothing scheduled.", "Book an appointment", "appointments.html");
  $("recent").innerHTML =
    ps
      .slice(-5)
      .reverse()
      .map(
        (p) =>
          `<li class="list-group-item"><a class="fw-semibold text-decoration-none" href="patient.html?id=${p.id}">${esc(p.name)}</a><div class="small text-muted">${age(p.dob)} yrs · ${esc(p.concern) || "No concern noted"}</div></li>`,
      )
      .join("") || empty("No patients yet.", "Add a patient", "patients.html");

  const as = all.filter((a) => a.status !== "Cancelled");
  const unpaid = as
    .filter((a) => a.payment !== "Paid")
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const paid = as
    .filter((a) => a.payment === "Paid")
    .sort((a, b) => (b.paidOn || b.date).localeCompare(a.paidOn || a.date));
  $("fin").innerHTML =
    card("Total not paid", money(sum(unpaid)), "cash-stack", "#b45309") +
    card("Appointments not paid", unpaid.length, "hourglass-split", "#b45309") +
    card("Total paid", money(sum(paid)), "check2-circle", "#0f766e") +
    card("Appointments paid", paid.length, "receipt", "#0f766e");
  $("unpaid").innerHTML =
    unpaid
      .map(
        (a) =>
          `<tr><td>${fmtDate(a.date)}<div class="small text-muted">${esc(a.time)}</div></td><td>${who(a)}</td><td>${esc(a.type)}</td><td><span class="badge text-bg-${badge[a.status]}">${esc(a.status)}</span></td><td class="text-end">${amt(a)}</td><td class="text-end"><button class="btn btn-sm btn-primary" onclick="setPay('${a.id}','Paid')">Mark paid</button></td></tr>`,
      )
      .join("") ||
    '<tr><td colspan="6" class="text-center text-muted py-4">Everything is paid. Nothing outstanding.</td></tr>';
  $("paid").innerHTML =
    paid
      .map(
        (a) =>
          `<tr><td>${fmtDate(a.date)}<div class="small text-muted">${esc(a.time)}</div></td><td>${who(a)}</td><td>${esc(a.type)}</td><td>${a.paidOn ? fmtDate(a.paidOn) : '<span class="text-muted small">Not recorded</span>'}</td><td class="text-end">${amt(a)}</td><td class="text-end"><button class="btn btn-sm btn-outline-secondary" onclick="setPay('${a.id}','Unpaid')">Mark unpaid</button></td></tr>`,
      )
      .join("") ||
    '<tr><td colspan="6" class="text-center text-muted py-4">No payments recorded yet.</td></tr>';
}
render();
