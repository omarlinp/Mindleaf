const year = document.getElementById("yr");
if (year) year.textContent = new Date().getFullYear();

const demoLaunch = document.getElementById("demoLaunch");
if (demoLaunch) {
  demoLaunch.addEventListener("click", () => {
    demoLaunch.classList.add("disabled");
    demoLaunch.setAttribute("aria-busy", "true");
    demoLaunch.textContent = "Opening demo…";
  });
}
