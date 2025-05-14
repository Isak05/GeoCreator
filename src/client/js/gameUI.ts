/**
 * This file contains the game UI logic for the client-side.
 * It handles the game map, timer, and user interactions.
 *
 * @module gameUI
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import GeocreatorMap from "./components/geocreator-map/index.js";
import GeocreatorTimer from "./components/geocreator-timer/geocreator-timer.js";
import Game, { Highscore } from "./game.js";
import highscoreTableRowTemplate from "./highscoreTableRow.html.js";

export default class GameUI {
  #mapElement: GeocreatorMap = null;
  #gameOverDiv: HTMLDivElement = null;
  #roundOverDiv: HTMLDivElement = null;
  #scoreSpan: HTMLSpanElement = null;
  #totalScoreSpan: HTMLSpanElement = null;
  #nextButton: HTMLButtonElement = null;
  #timerElement: GeocreatorTimer = null;
  #screenshotImage: HTMLImageElement = null;
  #submitForm: HTMLFormElement = null;
  #highscoreTableBody: HTMLTableSectionElement = null;
  #game: Game = null;
  #gameStarted: boolean = false;
  #totalTimePassed = 0;

  /**
   * Constructs a new instance of the class.
   *
   * @param url - The URL from where to fetch the game data.
   * @throws {TypeError} Throws an error if the provided `url` is neither a string nor an instance of `URL`.
   */
  constructor(url: string | URL) {
    if (typeof url !== "string" && !(url instanceof URL)) {
      throw new TypeError("expected a string or URL");
    }

    this.#game = new Game(url);
  }

  /**
   * Sets the map element.
   *
   * @param map The map element to be used.
   * @throws {TypeError} If the argument is not an instance of GeocreatorMap.
   */
  set mapElement(map: GeocreatorMap) {
    if (!(map instanceof GeocreatorMap)) {
      throw new TypeError("expected a GeocreatorMap");
    }

    this.#mapElement = map;
  }

  /**
   * Sets the game over div element.
   *
   * @param div The game over div element to be used.
   * @throws {TypeError} If the argument is not an HTMLDivElement.
   */
  set gameOverDiv(div: HTMLDivElement) {
    if (!(div instanceof HTMLDivElement)) {
      throw new TypeError("expected an HTMLDivElement");
    }

    this.#gameOverDiv = div;
    this.#gameOverDiv.hidden = true;
  }

  /**
   * Sets the round over div element.
   *
   * @param div The round over div element to be used.
   * @throws {TypeError} If the argument is not an HTMLDivElement.
   */
  set roundOverDiv(div: HTMLDivElement) {
    if (!(div instanceof HTMLDivElement)) {
      throw new TypeError("expected an HTMLDivElement");
    }
    this.#roundOverDiv = div;
    this.#roundOverDiv.hidden = true;
  }

  /**
   * Sets the score span element.
   *
   * @param span The score span element to be used.
   * @throws {TypeError} If the argument is not an HTMLSpanElement.
   */
  set scoreSpan(span: HTMLSpanElement) {
    if (!(span instanceof HTMLSpanElement)) {
      throw new TypeError("expected an HTMLSpanElement");
    }

    this.#scoreSpan = span;
  }

  /**
   * Sets the total score span element.
   *
   * @param span The total score span element to be used.
   * @throws {TypeError} If the argument is not an HTMLSpanElement.
   */
  set totalScoreSpan(span: HTMLSpanElement) {
    if (!(span instanceof HTMLSpanElement)) {
      throw new TypeError("expected an HTMLSpanElement");
    }

    this.#totalScoreSpan = span;
  }

  /**
   * Sets the next button element.
   *
   * @param button The next button element to be used.
   * @throws {TypeError} If the argument is not an HTMLButtonElement.
   */
  set nextButton(button: HTMLButtonElement) {
    if (!(button instanceof HTMLButtonElement)) {
      throw new TypeError("expected an HTMLButtonElement");
    }

    this.#nextButton = button;
  }

  /**
   * Sets the timer element.
   *
   * @param timer The timer element to be used.
   * @throws {TypeError} If the argument is not an instance of GeocreatorTimer.
   */
  set timerElement(timer: GeocreatorTimer) {
    if (!(timer instanceof GeocreatorTimer)) {
      throw new TypeError("expected a GeocreatorTimer");
    }

    this.#timerElement = timer;
  }

  /**
   * Sets the screenshot image element.
   *
   * @param image The screenshot image element to be used.
   * @throws {TypeError} If the argument is not an HTMLImageElement.
   */
  set screenshotImage(image: HTMLImageElement) {
    if (!(image instanceof HTMLImageElement)) {
      throw new TypeError("expected an HTMLImageElement");
    }

    this.#screenshotImage = image;
  }

  /**
   * Sets the form used for submitting the answer.
   *
   * @param form The form element to be used for submitting the answer.
   * @throws {TypeError} If the argument is not an HTMLFormElement.
   */
  set submitForm(form: HTMLFormElement) {
    if (!(form instanceof HTMLFormElement)) {
      throw new TypeError("expected an HTMLFormElement");
    }

    this.#submitForm = form;
  }

  /**
   * Sets the highscore table body element.
   *
   * @param tableBody - The HTMLTableSectionElement to be used as the highscore table.
   * @throws {TypeError} If the provided table is not an instance of HTMLTableSectionElement.
   */
  set highscoreTableBody(tableBody: HTMLTableSectionElement) {
    if (!(tableBody instanceof HTMLTableSectionElement)) {
      throw new TypeError("expected an HTMLTableSectionElement");
    }

    this.#highscoreTableBody = tableBody;
  }

  /**
   * Progresses to the next round of the game.
   * This method updates the game state, including the map and screenshot.
   * It also resets the timer for the next round.
   */
  async #nextRound() {
    this.#totalTimePassed +=
      this.#timerElement.totaltime - this.#timerElement.timeleft;
    this.#roundOverDiv.hidden = true;
    if (this.#game.gameOver) {
      this.#gameOverDiv.hidden = false;
      this.#totalScoreSpan.innerText = this.#game.totalScore.toString();

      try {
        await this.#game.postHighscore(
          this.#game.totalScore,
          this.#totalTimePassed / 1000
        );
      } catch {
        console.error("Couldn't post highscore")
      }
      this.#renderHighscoreTable();
      return;
    }

    this.#screenshotImage.src = this.#game.nextRound();
    this.#mapElement.src = this.#game.mapSrc;

    this.#timerElement.stopped = false;
    this.#timerElement.totaltime = 30000;
  }

  /**
   * Submits the user's guess and calculates the score.
   * This method prevents the default form submission behavior,
   * calculates the score based on the user's guess, and updates the UI accordingly.
   *
   * @param event The event object representing the form submission.
   */
  #submit() {
    const score = this.#game.submitGuess();
    this.#scoreSpan.innerText = score.toString();
    this.#roundOverDiv.hidden = false;
    this.#timerElement.stopped = true;
  }

  #renderHighscoreTable() {
    // Clear the table body before rendering
    this.#highscoreTableBody.innerHTML = "";

    // Sort highscores according to score and time.
    const sortedHighscores = this.#game.highscores.sort(
      (a: Highscore, b: Highscore) => {
        if (a.score === b.score) {
          return a.time - b.time;
        }
        return b.score - a.score;
      }
    );

    // Create a new row for each highscore and append it to the table body.
    for (const [index, highscore] of sortedHighscores.entries()) {
      const row = highscoreTableRowTemplate.content.cloneNode(
        true
      ) as HTMLTableRowElement;

      row.querySelector(".rank").textContent = `${index + 1}.`;
      row.querySelector(".name").textContent = highscore.user.username;
      row.querySelector(".score").textContent = highscore.score.toString();
      row.querySelector(".time").textContent = highscore.time.toString();

      this.#highscoreTableBody.appendChild(row);
    }
  }

  /**
   * Starts the game by fetching game data and setting up event listeners.
   *
   * @returns A promise that resolves when the game is started.
   */
  async start() {
    if (this.#gameStarted) {
      return;
    }
    this.#gameStarted = true;

    // Fetch game data
    await this.#game.fetchGameData();

    // Set up listeners
    this.#submitForm.addEventListener("submit", async (event: Event) => {
      event.preventDefault();
      this.#submit();
    });

    this.#nextButton.addEventListener("click", this.#nextRound.bind(this));

    this.#mapElement.addEventListener("markerplaced", (event: CustomEvent) => {
      const { x, y } = event.detail;
      this.#game.selectLocation(x, y);
    });

    this.#timerElement.addEventListener("timeout", () => {
      this.#submit();
    });

    // Start the first round of the game
    this.#nextRound();
  }
}
