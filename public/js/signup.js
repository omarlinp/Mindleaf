if (Auth.current()) location.replace("dashboard.html");
const pl = new URLSearchParams(location.search).get("plan");
if (PLANS[pl]) $("plan").value = pl;
else $("plan").value = "Professional";
$("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const err = $("err");
  err.classList.add("d-none");
  try {
    if ($("password").value !== $("confirm").value)
      throw new Error("Passwords do not match.");
    await Auth.signup({
      name: $("name").value,
      email: $("email").value,
      password: $("password").value,
      plan: $("plan").value,
    });
    location.href = "dashboard.html";
  } catch (x) {
    err.textContent = x.message;
    err.classList.remove("d-none");
  }
});
