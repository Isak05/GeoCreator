/**
 * The geocreator game module.
 *
 * @module game
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import Vec2 from "./vec2.ts";

type Screenshot = {
  url: string;
  correctAnswer: Vec2;
};

type GameData = {
  mapUrl: string;
  screenshots: Screenshot[];
};

const MAXIMUM_ROUND_SCORE = 1000;

export default class Game {
  #url: URL = null;
  #gameData: GameData = null;
  #guessPosition: Vec2 = new Vec2();
  #playedScreenshots: Set<Screenshot> = new Set();
  #currentScreenshot: Screenshot = null;

  /**
   * Creates a new game instance.
   *
   * @param url The URL of the game
   */
  constructor(url: URL | string) {
    if (typeof url !== "string" && !(url instanceof URL)) {
      throw new TypeError("non-url argument");
    }

    this.#url = new URL(url);
  }

  /**
   * Fetches the game data from the server.
   *
   * @returns The game data
   */
  async fetchGameData(): Promise<GameData> {
    if (this.#url === null) {
      throw new Error("url not set");
    }

    const response = await fetch(this.#url);
    if (!response.ok) {
      throw new Error("failed to fetch game data");
    }

    const data = await response.json();
    if (!data) {
      throw new Error("no data");
    }

    this.#gameData = data;
    return this.#gameData;
  }

  /**
   * Selects a location for guessing, but doesn't submit the guess.
   *
   * @param position The position to guess
   */
  selectLocation(x: number, y: number): void {
    if (typeof x !== "number" || typeof y !== "number") {
      throw new TypeError("non-number argument");
    }

    this.#guessPosition.x = x;
    this.#guessPosition.y = y;
  }

  /**
   * Goes to the next round.
   */
  nextRound(): string {
    if (this.#gameData === null) {
      throw new Error("gameData not set");
    }

    const remainingScreenshots = new Set(this.#gameData.screenshots).difference(
      this.#playedScreenshots
    );

    if (remainingScreenshots.size === 0) {
      throw new Error("no more screenshots");
    }

    const numberRemainingScreenshots = remainingScreenshots.size;
    const randomIndex = Math.floor(Math.random() * numberRemainingScreenshots);
    const randomScreenshot = Array.from(remainingScreenshots)[randomIndex];

    this.#currentScreenshot = randomScreenshot;
    this.#playedScreenshots.add(randomScreenshot);

    return randomScreenshot.url;
  }

  /**
   * Calculates the score based on the distance between the picked position and the correct position.
   *
   * @param position The picked position
   * @param correctPosition The correct position
   * @returns The score
   */
  calculateScore(): number {
    const position = this.#guessPosition;
    const correctPosition = this.#currentScreenshot.correctAnswer;
    console.log(this.#currentScreenshot)

    if (!Number.isFinite(position.x) || !Number.isFinite(position.y)) {
      throw new Error("bad position");
    }

    if (
      !Number.isFinite(correctPosition.x) ||
      !Number.isFinite(correctPosition.y)
    ) {
      throw new Error("bad correctPosition");
    }

    // ⌊1000*min(e^(-10x)*1.1,1)+0.5⌋
    const distance = Math.sqrt(
      (position.x - correctPosition.x) ** 2 +
        (position.y - correctPosition.y) ** 2
    );
    const scoreFactor = Math.min(Math.exp(-10 * distance) * 1.1, 1);
    const score = Math.round(MAXIMUM_ROUND_SCORE * scoreFactor);

    return score;
  }

  /**
   * @returns The URL of the map image
   */
  get mapSrc(): string {
    return this.#gameData?.mapUrl;
  }
}
