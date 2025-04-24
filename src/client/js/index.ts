import "./components/geocreator-map/index.ts";
import "./components/geocreator-timer/index.ts";

import GeocreatorMap from "./components/geocreator-map/geocreator-map.ts";
import GeocreatorTimer from "./components/geocreator-timer/geocreator-timer.ts";
import Game from "./game.ts";

async function main() {
  const map: GeocreatorMap = document.querySelector("#map");
  const gameOverDiv: HTMLDivElement = document.querySelector("#game-over");
  const scoreSpan: HTMLSpanElement = document.querySelector("#score");
  const nextButton: HTMLButtonElement = document.querySelector("#next-button");
  const timer: GeocreatorTimer = document.querySelector("#timer");
  const screenshot: HTMLImageElement = document.querySelector("#screenshot");
  const form: HTMLFormElement = document.querySelector("#guess-form");

  const url = new URL(
    "./game/6808de1c07e7413eb7388e4a",
    document.baseURI + "/"
  );
  const game = new Game(url);
  await game.fetchGameData();

  gameOverDiv.hidden = true;

  map.addEventListener("markerplaced", (event: CustomEvent) => {
    const { x, y } = event.detail;
    game.selectLocation(x, y);
  });

  map.src = game.mapSrc;

  screenshot.src = game.nextRound();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const score = game.calculateScore();
    scoreSpan.innerText = score.toString();
    gameOverDiv.hidden = false;
    timer.stopped = true;
  });

  nextButton.addEventListener("click", async () => {
    gameOverDiv.hidden = true;
    screenshot.src = game.nextRound();
    map.src = game.mapSrc;

    timer.stopped = false;
    timer.totaltime = 30000;
  });
}

main();
