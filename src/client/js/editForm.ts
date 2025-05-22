import MyAlert from "./components/my-alert/my-alert.js";
import getView from "./utils/getView.js";

// Only run this script if the user is in the edit view.
if (getView() === "edit") {
  const editForm: HTMLFormElement = document.querySelector("#edit-form");

  editForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(editForm);
    const response = await fetch(editForm.action, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      const alert = new MyAlert(
        "danger",
        "An error occurred. Please try again.",
      );
      document.querySelector("#flash-div").appendChild(alert);
    } else {
      const alert = new MyAlert("success", "Game updated successfully.");
      document.querySelector("#flash-div").appendChild(alert);
    }
  });
}
