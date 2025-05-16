import GameUI from "./gameUI.js";
import Modal from "./utils/modal/modal.js";
import MyAlert from "./components/my-alert/my-alert.js";
import getView from "./utils/getView.js";

// Only run this script if the user is in the editLocation view.
if (getView() === "game") {
  const url = new URL("./data", document.location.href + "/");
  const gameUI = new GameUI(url);
  gameUI.mapElement = document.querySelector("#map");
  gameUI.gameOverDiv = document.querySelector("#game-over");
  gameUI.roundOverDiv = document.querySelector("#round-over");
  gameUI.scoreSpan = document.querySelector("#score");
  gameUI.totalScoreSpan = document.querySelector("#total-score");
  gameUI.timerElement = document.querySelector("#timer");
  gameUI.screenshotImage = document.querySelector("#screenshot");
  gameUI.submitForm = document.querySelector("#guess-form");
  gameUI.highscoreTableBody = document.querySelector(
    "#highscore-table > tbody",
  );

  /**
   *
   */
  async function play() {
    document.querySelector("#pre-start-div").setAttribute("hidden", "");
    document.querySelector("#game-div").removeAttribute("hidden");

    // requestAnimationFrame tries to fix the map being zoomed out on start, but it is not 100% reliable.
    requestAnimationFrame(gameUI.start.bind(gameUI));
  }

  document
    .querySelector("#play-button")
    ?.addEventListener("click", async (event) => {
      event.preventDefault();

      play();
    });

  document
    .querySelector("#delete-button")
    ?.addEventListener("click", async (event) => {
      event.preventDefault();

      const confirmationModal = new Modal(
        "Delete Game",
        "Are you sure you want to delete this game?",
        Modal.PromptType.YESNO,
      );
      if (!(await confirmationModal.show())) {
        return;
      }

      const response = await fetch(location.href, {
        method: "DELETE",
      });

      if (response.ok) {
        location.href = location.href.replace(/game\/[^/]+\/?$/, "");
      } else {
        const alert = new MyAlert("danger", "Failed to delete game");
        document.querySelector("#flash-div").appendChild(alert);
      }
    });
}
