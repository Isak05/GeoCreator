/*
 * GeoCreator game and creation platform.
 * Copyright (C) 2025 Isak Johansson Weckstén
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, see
 * <https://www.gnu.org/licenses/>.
 */

import GameUI from "./gameUI.js";
import Modal from "./utils/modal/modal.js";
import MyAlert from "./components/my-alert/my-alert.js";
import getView from "./utils/getView.js";
import GeocreatorRating from "./components/geocreator-rating/geocreator-rating.js";

// Only run this script if the user is in the game view.
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
   * Function to start the game.
   */
  async function play() {
    document.querySelector("#pre-start-div").setAttribute("hidden", "");
    document.querySelector("#game-div").removeAttribute("hidden");

    // requestAnimationFrame tries to fix the map being zoomed out on start, but it is not 100% reliable.
    requestAnimationFrame(gameUI.start.bind(gameUI));
  }

  // Handle play button click
  document
    .querySelector("#play-button")
    ?.addEventListener("click", async (event) => {
      event.preventDefault();

      play();
    });

  // Handle delete button click
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

  // Handle rating
  document
    .querySelector("geocreator-rating")
    ?.addEventListener("change", async (event) => {
      const ratingElement = event.target as GeocreatorRating;

      // The rating as a number 1-5
      const rating = ratingElement.rating;

      // Send a request to the server to save the rating
      const response = await fetch(
        location.href.replace(/\/+$/, "") + "/rating",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rating }),
        },
      );

      // Check if the request was successful
      if (response.status === 403) {
        ratingElement.rating = null;

        const alert = new MyAlert(
          "danger",
          "You must be logged in to rate a game.",
        );
        document.querySelector("#flash-div").appendChild(alert);
      } else if (!response.ok) {
        ratingElement.rating = null;

        const alert = new MyAlert(
          "danger",
          "Failed to save rating. Please try again later.",
        );
        document.querySelector("#flash-div").appendChild(alert);
      }
    });
}
