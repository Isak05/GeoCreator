import { GeocreatorMap } from "./components/geocreator-map/geocreator-map.js";

const url = new URL("./game/6808de1c07e7413eb7388e4a", document.baseURI + "/");
const response = await fetch(url);
const data = await response.json();
console.log(data);

const map: GeocreatorMap = document.querySelector("#map");
map.src = data.mapUrl;

map.addEventListener("markerplaced", (event: CustomEvent) => {
  const { x, y } = event.detail;
  console.log(`Marker placed at x: ${x}, y: ${y}`);
});

const screenshot: HTMLImageElement = document.querySelector("#screenshot");
screenshot.src = data.screenshotUrls[0];

const form: HTMLFormElement = document.querySelector("#guess-form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  map.src = data.mapUrl;
  console.log("Submitted");
});
