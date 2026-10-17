const modal = new bootstrap.Modal($("modal")),
  F = [
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
function render() {
  const q = $("q").value.toLowerCase(),
    as = DB.get("appts");
  $("rows").innerHTML =
    DB.get("patients")
      .filter((p) =>
        [p.name, p.phone, p.email, p.concern]
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
      .map(
        (p) =>
          `<tr><td><a class="fw-semibold text-decoration-none" href="patient.html?id=${p.id}">${esc(p.name)}</a><div class="small text-muted">${esc(p.email)}</div></td><td>${age(p.dob)}</td><td>${esc(p.gender)}</td><td>${esc(p.phone)}</td><td>${esc(p.concern)}</td><td>${as.filter((a) => a.pid === p.id).length}</td>
   <td class="text-end text-nowrap"><a class="btn btn-sm btn-primary" href="patient.html?id=${p.id}">Open file</a> <button class="btn btn-sm btn-outline-primary" onclick="openForm('${p.id}')">Edit</button> <button class="btn btn-sm btn-outline-danger" onclick="del('${p.id}')">Delete</button></td></tr>`,
      )
      .join("") ||
    '<tr><td colspan="7" class="text-center text-muted py-4">No patients found. Add a patient to get started.</td></tr>';
}
function openForm(id) {
  const p = DB.get("patients").find((x) => x.id === id) || {};
  $("title").textContent = id ? "Edit patient" : "Add patient";
  $("pid").value = id || "";
  F.forEach((k) => ($(k).value = p[k] || (k === "gender" ? "Female" : "")));
  modal.show();
}
$("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const list = DB.get("patients"),
    id = $("pid").value;
  const p = { id: id || DB.id() };
  F.forEach((k) => (p[k] = $(k).value.trim()));
  DB.set(
    "patients",
    id ? list.map((x) => (x.id === id ? p : x)) : [...list, p],
  );
  modal.hide();
  render();
});
function del(id) {
  if (
    !confirm(
      "Delete this patient and their appointments? This cannot be undone.",
    )
  )
    return;
  DB.set(
    "patients",
    DB.get("patients").filter((p) => p.id !== id),
  );
  DB.set(
    "appts",
    DB.get("appts").filter((a) => a.pid !== id),
  );
  render();
}
$("q").addEventListener("input", render);
render();
if (qs.get("edit")) openForm(qs.get("edit"));
