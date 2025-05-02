const editForm: HTMLFormElement = document.querySelector("#edit-form");

editForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(editForm);
  const response = await fetch(editForm.action, {
    method: "PUT",
    body: formData,
  });

  if (response.ok) {
    window.location.href = response.url;
  } else {
    console.error("Error:", response.statusText);
  }
});
