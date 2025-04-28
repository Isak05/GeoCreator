import "./components/geocreator-map/index.js";
import "./components/geocreator-timer/index.js";

import GameUI from "./gameUI.js";

async function main() {
  const url = new URL("./data", document.location.href + "/");
  const gameUI = new GameUI(url);

  gameUI.mapElement = document.querySelector("#map");
  gameUI.gameOverDiv = document.querySelector("#game-over");
  gameUI.roundOverDiv = document.querySelector("#round-over");
  gameUI.scoreSpan = document.querySelector("#score");
  gameUI.totalScoreSpan = document.querySelector("#total-score");
  gameUI.nextButton = document.querySelector("#next-button");
  gameUI.timerElement = document.querySelector("#timer");
  gameUI.screenshotImage = document.querySelector("#screenshot");
  gameUI.submitForm = document.querySelector("#guess-form");

  await gameUI.start();
}

main();
