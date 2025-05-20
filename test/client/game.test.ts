/**
 * Tests for Game class.
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import Game from "../../src/client/js/game.ts";
import Vec2 from "../../src/client/js/vec2.ts";
import highscoreData from "./highscoreData.ts";

// Mock fetching `https://example.com/data` to return a game object
const gameData = {
  mapUrl: "https://example.com/map.png",
  screenshots: [
    {
      url: "https://example.com/screenshot1.png",
      correctAnswer: { x: 0.1, y: 0.2 },
    },
    {
      url: "./screenshot2.png",
      correctAnswer: { x: 0.3, y: 0.4 },
    },
  ],
};

jest.spyOn(global, "fetch").mockImplementation(
  jest.fn((url) => {
    switch (url.href) {
      case "https://example.com/data":
        return Promise.resolve({
          ok: true,
          /**
           * Mocking the response of the fetch call to return game data.
           * @returns A promise that resolves to a Response object.
           */
          json: (): Promise<Response> =>
            Promise.resolve(JSON.parse(JSON.stringify(gameData))),
        });
      case "https://example.com/highscore":
        return Promise.resolve({
          ok: true,
          /**
           * Mocking the response of the fetch call to return highscore data.
           * @returns A promise that resolves to a Response object.
           */
          json: (): Promise<Response> =>
            Promise.resolve(JSON.parse(JSON.stringify(highscoreData))),
        });
      default:
        return Promise.resolve({
          ok: false,
        });
    }
  }) as jest.Mock,
);

// Mocking the window object to provide a location property
Object.defineProperty(global, "window", {
  value: {
    location: {
      origin: "https://example.com",
    },
  },
});

describe("Game", () => {
  describe("constructor", () => {
    it("should create a Game object with a URL", async () => {
      const game = new Game("https://example.com/data");

      expect(game).toBeInstanceOf(Game);
    });

    it("should throw an error if the URL is invalid", () => {
      expect(() => new Game(1 as unknown as string)).toThrow(TypeError);
      expect(() => new Game({} as unknown as string)).toThrow(TypeError);
      expect(() => new Game(null as unknown as string)).toThrow(TypeError);
      expect(() => new Game(undefined as unknown as string)).toThrow(TypeError);
    });
  });

  describe("fetchGameData", () => {
    it("should fetch game data from the server", async () => {
      const game = new Game("https://example.com/data");
      const data = await game.fetchGameData();
      expect(data).toEqual(gameData);
      expect(game.mapSrc).toBe(gameData.mapUrl);
    });
  });

  describe("nextRound", () => {
    it("should fetch the next round data", async () => {
      const game = new Game("https://example.com/data");
      await game.fetchGameData();
      let nextRound = game.nextRound();
      expect(
        gameData.screenshots.map((screenshot) => screenshot.url),
      ).toContain(nextRound);

      nextRound = game.nextRound();
      expect(
        gameData.screenshots.map((screenshot) => screenshot.url),
      ).toContain(nextRound);
    });

    it("should throw an error if there are no more rounds", async () => {
      const game = new Game("https://example.com/data");
      await game.fetchGameData();
      game.nextRound();
      game.nextRound();
      expect(() => game.nextRound()).toThrow(Error);
    });
  });

  describe("selectLocation", () => {
    it("should select a location for guessing", async () => {
      const game = new Game("https://example.com/data");
      await game.fetchGameData();
      game.nextRound();
      game.selectLocation(0.2, 0.2);
      expect(game.guessPosition.x).toEqual(0.2);
      expect(game.guessPosition.y).toEqual(0.2);
      expect(game.guessPosition).toBeInstanceOf(Vec2);
    });
    it("should throw an error if the coordinates are invalid", async () => {
      const game = new Game("https://example.com/data");
      await game.fetchGameData();
      game.nextRound();
      expect(() =>
        game.selectLocation("0.2" as unknown as number, 0.2),
      ).toThrow(TypeError);
      expect(() =>
        game.selectLocation(0.2, "0.2" as unknown as number),
      ).toThrow(TypeError);
      expect(() => game.selectLocation(0.2, null as unknown as number)).toThrow(
        TypeError,
      );
      expect(() =>
        game.selectLocation(0.2, undefined as unknown as number),
      ).toThrow(TypeError);
    });
  });

  describe("calculateScore", () => {
    it("should calculate the score based on the distance to the correct answer", async () => {
      const game = new Game("https://example.com/data");
      await game.fetchGameData();
      game.nextRound();
      game.selectLocation(0.1, 0.2);
      expect([65, 1000]).toContain(game.calculateScore());
    });
    it("should return zero if no guess has been made", async () => {
      const game = new Game("https://example.com/data");
      await game.fetchGameData();
      game.nextRound();
      expect(game.calculateScore()).toBe(0);
    });
  });

  describe("totalScore", () => {
    it("should return the total score", async () => {
      const game = new Game("https://example.com/data");
      await game.fetchGameData();
      expect(game.totalScore).toBe(0);

      for (let i = 0; i < gameData.screenshots.length; i++) {
        game.nextRound();
        game.selectLocation(0.5, 0.5);
        game.submitGuess();
      }

      expect(game.totalScore).toBe(125);
    });
  });

  describe("postHighscore", () => {
    it("should post the high score to the server", async () => {
      const game = new Game("https://example.com/data");
      await game.fetchGameData();
      game.nextRound();
      game.selectLocation(0.5, 0.5);
      game.submitGuess();

      await game.postHighscore(100, 14.433);
      expect(game.highscores).toEqual(highscoreData);
    });
  });
});
