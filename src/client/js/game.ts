/**
 * The geocreator game module.
 * @module game
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import Vec2 from "./vec2.js";

type Screenshot = {
  url: string;
  correctAnswer: Vec2;
};

type User = {
  username: string;
};

export type Highscore = {
  user: User;
  score: number;
  time: number;
};

type GameData = {
  mapUrl: string;
  screenshots: Screenshot[];
  highscoreList: Highscore[];
};

export enum GameState {
  NOT_STARTED,
  WAITING_FOR_GUESS,
  WAITING_FOR_NEXT_ROUND,
  GAME_OVER,
}

const NUMBER_OF_ROUNDS_PER_GAME = 5;

/**
 * The game class responsible for handling the game logic, game state and fetching game data.
 */
export default class Game {
  #maximumRoundScore = 1000;
  #url: URL = null;
  #gameData: GameData = null;
  #guessPosition: Vec2 = null;
  #playedScreenshots: Set<Screenshot> = new Set();
  #currentScreenshot: Screenshot = null;
  #totalScore = 0;
  #state: GameState = GameState.NOT_STARTED;
  #roundsPlayed = 0;

  /**
   * Creates a new game instance.
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
   * @returns The game data
   */
  async fetchGameData(): Promise<GameData> {
    if (this.#state !== GameState.NOT_STARTED) {
      throw new Error("cannot fetch game data in current state");
    }

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

    this.#state = GameState.WAITING_FOR_NEXT_ROUND;
    this.#gameData = data;
    return this.#gameData;
  }

  /**
   * Selects a location for guessing, but doesn't submit the guess.
   * @param x The x coordinate of the position
   * @param y The y coordinate of the position
   */
  selectLocation(x: number, y: number): void {
    if (this.#state !== GameState.WAITING_FOR_GUESS) {
      throw new Error("cannot select location in current state");
    }

    if (typeof x !== "number" || typeof y !== "number") {
      throw new TypeError("non-number argument");
    }

    this.#guessPosition = new Vec2(x, y);
  }

  /**
   * Goes to the next round.
   * @returns The URL of the next screenshot
   */
  nextRound(): string {
    if (this.#state === GameState.WAITING_FOR_GUESS) {
      this.submitGuess();
    }

    if (this.#state !== GameState.WAITING_FOR_NEXT_ROUND) {
      throw new Error("cannot go to next round in current state");
    }

    if (this.#gameData === null) {
      throw new Error("gameData not set");
    }

    this.#guessPosition = null;

    const remainingScreenshots = this.#getRemainingScreenshots();

    if (remainingScreenshots.size === 0) {
      throw new Error("no more rounds");
    }

    const numberRemainingScreenshots = remainingScreenshots.size;
    const randomIndex = Math.floor(Math.random() * numberRemainingScreenshots);
    const randomScreenshot = Array.from(remainingScreenshots)[randomIndex];

    this.#currentScreenshot = randomScreenshot;
    this.#playedScreenshots.add(randomScreenshot);
    this.#state = GameState.WAITING_FOR_GUESS;

    return randomScreenshot.url;
  }

  /**
   * Calculates the score based on the distance between the picked position and the correct position.
   * @returns The score
   */
  calculateScore(): number {
    const position = this.#guessPosition;
    const correctPosition = this.#currentScreenshot.correctAnswer;

    if (position === null) {
      return 0;
    }

    if (correctPosition === null) {
      throw new Error("no correct position");
    }

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
        (position.y - correctPosition.y) ** 2,
    );
    const scoreFactor = Math.min(Math.exp(-10 * distance) * 1.1, 1);
    const score = Math.round(this.#maximumRoundScore * scoreFactor);

    return score;
  }

  /**
   * Submits the guess and calculates the score.
   * This method updates the total score and returns the score for the current round.
   * @returns The score for the current round
   */
  submitGuess(): number {
    if (this.#state !== GameState.WAITING_FOR_GUESS) {
      throw new Error("cannot submit guess in current state");
    }

    const score = this.calculateScore();
    this.#totalScore += score;
    this.#roundsPlayed++;

    if (
      this.#getRemainingScreenshots().size === 0 ||
      this.#roundsPlayed >= NUMBER_OF_ROUNDS_PER_GAME
    ) {
      this.#state = GameState.GAME_OVER;
    } else {
      this.#state = GameState.WAITING_FOR_NEXT_ROUND;
    }

    return score;
  }

  /**
   * @returns The remaining screenshots that have not been played yet.
   */
  #getRemainingScreenshots(): Set<Screenshot> {
    return new Set(this.#gameData.screenshots).difference(
      this.#playedScreenshots,
    );
  }

  /**
   * Sends a highscore to the server and updates the local highscore list.
   * @param score - The player's score to be posted.
   * @param time - The time associated with the score.
   * @returns A promise that resolves when the highscore is successfully posted.
   * @throws An error if the request to post the highscore fails.
   */
  async postHighscore(score: number, time: number): Promise<void> {
    const highscore = {
      score,
      time,
    };

    const url = new URL("../highscore", this.#url + "/");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(highscore),
    });

    if (!response.ok) {
      throw new Error("failed to post highscore");
    }
    const data = await response.json();

    this.#gameData.highscoreList = data;
  }

  /**
   * @returns The URL of the map image
   */
  get mapSrc(): string {
    return this.#gameData?.mapUrl;
  }

  /**
   * @returns The current total score.
   */
  get totalScore(): number {
    return this.#totalScore;
  }

  /**
   * @returns True if the game is over, false otherwise.
   */
  get gameOver(): boolean {
    return this.#state === GameState.GAME_OVER;
  }

  /**
   * @returns The list of highscores.
   */
  get highscores(): Highscore[] {
    return this.#gameData?.highscoreList;
  }

  /**
   * @returns The correct answer for the current screenshot.
   */
  get correctAnswer(): Vec2 {
    return this.#currentScreenshot?.correctAnswer;
  }

  /**
   * @returns The currently selected position for guessing.
   */
  get guessPosition(): Vec2 {
    return this.#guessPosition;
  }

  /**
   * @returns The current game state.
   */
  get state(): GameState {
    return this.#state;
  }
}
