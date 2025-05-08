import MyAlert from "./components/my-alert/my-alert.js";

const editForm: HTMLFormElement = document.querySelector("#edit-form");

editForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(editForm);
  const response = await fetch(editForm.action, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const alert = new MyAlert("danger", "An error occurred. Please try again.");
    document.querySelector("#flash-div").appendChild(alert);
  } else {
    const alert = new MyAlert("success", "Game updated successfully.");
    document.querySelector("#flash-div").appendChild(alert);
  }
});
