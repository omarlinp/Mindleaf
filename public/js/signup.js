const profilePicture = document.getElementById("profilePicture");
const profilePreview = document.getElementById("profilePreview");
const profilePreviewPlaceholder = document.getElementById(
  "profilePreviewPlaceholder",
);

if (profilePicture && profilePreview && profilePreviewPlaceholder) {
  profilePicture.addEventListener("change", () => {
    const file = profilePicture.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      profilePreview.removeAttribute("src");
      profilePreview.classList.add("d-none");
      profilePreviewPlaceholder.classList.remove("d-none");
      return;
    }

    profilePreview.src = URL.createObjectURL(file);
    profilePreview.classList.remove("d-none");
    profilePreviewPlaceholder.classList.add("d-none");
  });
}
