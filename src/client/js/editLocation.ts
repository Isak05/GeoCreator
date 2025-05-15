import GeocreatorMap from "./components/geocreator-map";
import MyAlert from "./components/my-alert/my-alert.js";
import Modal from "./utils/modal/modal.js";

type Screenshot = {
  _id: string;
  url: string;
  correctAnswer: {
    x: number;
    y: number;
  };
};

// Elements
const map: GeocreatorMap = document.querySelector("#map");
const pickLocationMap: GeocreatorMap =
  document.querySelector("#pick-location-map");
const pickLocationContainer: HTMLDivElement = document.querySelector(
  "#pick-location-container"
);
const pickLocationButton: HTMLInputElement = document.querySelector(
  "#pick-location-button"
);
const cancelPickLocationButton: HTMLInputElement = document.querySelector(
  "#cancel-pick-location"
);
const submitPickLocationButton: HTMLInputElement = document.querySelector(
  "#submit-pick-location"
);
const pickLocationForm: HTMLFormElement = document.querySelector(
  "#pick-location-form"
);
const addScreenshotForm: HTMLFormElement = document.querySelector(
  "#add-screenshot-form"
);

const gameUrl: URL = new URL("../data", location.href.replace(/\/+$/, ""));
let gameData: any = null;

/**
 * Deletes a screenshot by its ID and updates the application state accordingly.
 *
 * @param id - The unique identifier of the screenshot to be deleted.
 * @returns A promise that resolves when the operation is complete.
 *
 * @remarks
 * - Sends a DELETE request to the server to remove the screenshot.
 * - Updates the `gameData.screenshots` array to exclude the deleted screenshot.
 * - Displays a success or error alert based on the outcome of the operation.
 * - Clears and re-renders the map with the updated screenshots.
 */
async function deleteScreenshot(id: string) {
  const url = new URL(`../screenshot/${id}`, location.href.replace(/\/+$/, ""));

  const response = await fetch(url, {
    method: "DELETE",
  });
  if (!response.ok) {
    const alert = new MyAlert(
      "danger",
      "Failed to delete screenshot. Please try again."
    );
    document.querySelector("#flash-div").appendChild(alert);
    return;
  }

  gameData.screenshots = gameData.screenshots.filter(
    (screenshot: Screenshot) => screenshot._id !== id
  );

  const alert = new MyAlert("success", "Screenshot deleted successfully.");
  document.querySelector("#flash-div").appendChild(alert);

  map.reset();
  markScreenshots(gameData.screenshots);
}

/**
 * Place markers on the map for each screenshot in the game data.
 *
 * @param screenshots - An array of screenshot objects containing the coordinates and URL.
 */
function markScreenshots(screenshots: Screenshot[]) {
  for (const screenshot of screenshots) {
    map.placeMarkerLink(
      screenshot.correctAnswer.x,
      screenshot.correctAnswer.y,
      null,
      async () => {
        handleMarkerClick(screenshot);
      }
    );
  }
}

/**
 * Handles the click event on a marker by displaying a modal with the screenshot
 * and providing options to delete it. If the user confirms deletion, the screenshot
 * is removed.
 *
 * @param screenshot - The screenshot object containing the details of the image to display.
 * @returns A promise that resolves when the operation is complete.
 */
async function handleMarkerClick(screenshot: Screenshot) {
  const img = document.createElement("img");
  img.src = screenshot.url;
  img.style.width = "100%";
  const modal = new Modal("", img, Modal.PromptType.CANCELDELETE);
  if (!(await modal.show())) {
    return;
  }

  const confirmationModal = new Modal(
    "Delete Screenshot",
    "Are you sure you want to delete this screenshot?",
    Modal.PromptType.YESNO
  );
  if (!(await confirmationModal.show())) {
    return;
  }

  return deleteScreenshot(screenshot._id);
}

// Event listeners
pickLocationButton?.addEventListener("click", () => {
  pickLocationContainer?.removeAttribute("hidden");
});

pickLocationForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  switch (event.submitter) {
    case cancelPickLocationButton:
      pickLocationContainer?.setAttribute("hidden", "true");
      break;
    case submitPickLocationButton:
      const { x, y } = pickLocationMap.markerPosition;
      (document.querySelector("#x-input") as HTMLInputElement).value =
        x.toString();
      (document.querySelector("#y-input") as HTMLInputElement).value =
        y.toString();
      pickLocationContainer?.setAttribute("hidden", "true");
      break;
  }
});

addScreenshotForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(addScreenshotForm);
  if(formData.get("x") === "" || formData.get("y") === "") {
    const alert = new MyAlert(
      "danger",
      "Please pick a location.",
    );
    document.querySelector("#flash-div").appendChild(alert);
    return;
  }

  const response = await fetch(addScreenshotForm.action, {
    method: addScreenshotForm.method,
    body: formData,
  });

  if (!response.ok) {
    const alert = new MyAlert(
      "danger",
      "Failed to add screenshot. Please try again."
    );
    document.querySelector("#flash-div").appendChild(alert);
    return;
  }

  const data = await response.json();

  gameData.screenshots.push(data);
  map.reset();
  markScreenshots(gameData.screenshots);

  const alert = new MyAlert(
    "success",
    "Screenshot added successfully.",
  );
  document.querySelector("#flash-div").appendChild(alert);
});

(async () => {
  // Fetch the game data from the server.
  try {
    const response = await fetch(gameUrl);
    if (!response.ok) {
      throw new Error();
    }
    gameData = await response.json();
  } catch (error) {
    const alert = new MyAlert(
      "danger",
      "Failed to get game data. Please try again."
    );
    document.querySelector("#flash-div").appendChild(alert);
    return;
  }

  markScreenshots(gameData.screenshots);
})();
