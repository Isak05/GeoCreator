import "./components/geocreator-map/index.ts";
import "./components/geocreator-timer/index.ts";

import GameUI from "./gameUI.ts";

async function main() {
  const url = new URL(
    "./game/6808de1c07e7413eb7388e4a",
    document.baseURI + "/"
  );
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
