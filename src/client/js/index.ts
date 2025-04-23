import GeocreatorMap from "./components/geocreator-map/geocreator-map.js";
import GeocreatorTimer from "./components/geocreator-timer/geocreator-timer.js";
import Game from "./game.js";

const map: GeocreatorMap = document.querySelector("#map");
const gameOverDiv: HTMLDivElement = document.querySelector("#game-over");
const scoreSpan: HTMLSpanElement = document.querySelector("#score");
const nextButton: HTMLButtonElement = document.querySelector("#next-button");
const timer: GeocreatorTimer = document.querySelector("#timer");
const screenshot: HTMLImageElement = document.querySelector("#screenshot");
const form: HTMLFormElement = document.querySelector("#guess-form");

const url = new URL("./game/6808de1c07e7413eb7388e4a", document.baseURI + "/");
const game = new Game(url);
await game.fetchGameData();

gameOverDiv.hidden = true;

map.addEventListener("markerplaced", (event: CustomEvent) => {
  const { x, y } = event.detail;
  game.selectLocation(x, y);
});

map.src = game.mapSrc;

screenshot.src = game.nextRound().href;

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const score = game.calculateScore();
  scoreSpan.innerText = score.toString();
  gameOverDiv.hidden = false;
  timer.stopped = true;
});

nextButton.addEventListener("click", async () => {
  gameOverDiv.hidden = true;
  screenshot.src = game.nextRound().href;

  timer.stopped = false;
  timer.totalTime = 30000;
});
