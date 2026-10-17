if (Auth.current()) location.replace("dashboard.html");
$("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  $("err").classList.add("d-none");
  try {
    await Auth.login($("email").value, $("password").value);
    location.href = "dashboard.html";
  } catch (x) {
    $("err").textContent = x.message;
    $("err").classList.remove("d-none");
  }
});
$("demo").addEventListener("click", () => {
  Auth.demo();
  location.href = "dashboard.html";
});
