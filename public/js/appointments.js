const modal = new bootstrap.Modal($("modal")),
  F = [
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
$("type").innerHTML = TYPES.map((t) => `<option>${t}</option>`).join("");
function render() {
  const st = $("flt").value;
  $("rows").innerHTML =
    DB.get("appts")
      .filter((a) => !st || a.status === st)
      .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))
      .map(
        (a) =>
          `<tr><td>${fmtDate(a.date)}</td><td>${esc(a.time)}</td><td><a class="fw-semibold text-decoration-none" href="patient.html?id=${a.pid}">${esc(pname(a.pid))}</a></td><td>${esc(a.type)}</td><td>${esc(a.mode)}</td>
   <td><span class="badge text-bg-${badge[a.status]}">${esc(a.status)}</span></td>
   <td>${a.status === "Cancelled" ? '<span class="text-muted small">n/a</span>' : `<span class="badge text-bg-${a.payment === "Paid" ? "success" : "warning"}">${a.payment === "Paid" ? "Paid" : "Unpaid"}</span><div class="small text-muted">${money(a.fee)}</div>`}</td>
   <td class="text-end text-nowrap"><a class="btn btn-sm btn-primary" href="appointment.html?id=${a.id}">Notes</a> <button class="btn btn-sm btn-outline-primary" onclick="openForm('${a.id}')">Edit</button> <button class="btn btn-sm btn-outline-danger" onclick="del('${a.id}')">Delete</button></td></tr>`,
      )
      .join("") ||
    '<tr><td colspan="8" class="text-center text-muted py-4">No appointments found. Book an appointment to get started.</td></tr>';
}
function openForm(id, pid) {
  const ps = DB.get("patients");
  if (!ps.length) {
    alert("Add a patient first, then book their appointment.");
    return;
  }
  $("pid").innerHTML = ps
    .map((p) => `<option value="${p.id}">${esc(p.name)}</option>`)
    .join("");
  const a = DB.get("appts").find((x) => x.id === id) || {
    status: "Scheduled",
    date: today(),
    type: "Individual therapy",
    mode: "In person",
    duration: "50",
    payment: "Unpaid",
    pid,
  };
  $("title").textContent = id ? "Edit appointment" : "Book appointment";
  $("aid").value = id || "";
  F.forEach((k) => ($(k).value = a[k] || ""));
  modal.show();
}
$("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const list = DB.get("appts"),
    id = $("aid").value,
    old = list.find((x) => x.id === id) || {};
  const a = { ...old, id: id || DB.id() };
  F.forEach((k) => (a[k] = $(k).value.trim()));
  if (a.payment === "Paid") {
    if (!a.paidOn) a.paidOn = today();
  } else delete a.paidOn;
  DB.set("appts", id ? list.map((x) => (x.id === id ? a : x)) : [...list, a]);
  modal.hide();
  render();
});
function del(id) {
  if (
    confirm("Delete this appointment and its notes? This cannot be undone.")
  ) {
    DB.set(
      "appts",
      DB.get("appts").filter((a) => a.id !== id),
    );
    render();
  }
}
$("flt").addEventListener("change", render);
render();
if (qs.get("new")) openForm("", qs.get("new"));
