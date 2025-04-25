/**
 * Tests for Game class.
 *
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import Game from "../../src/client/js/game.ts";

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
  jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(JSON.parse(JSON.stringify(gameData))),
    })
  ) as jest.Mock
);

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
      const game = new Game("https://example.com/game");
    });

    it("should throw an error if the URL is invalid", () => {
      expect(() => new Game(1 as unknown as string)).toThrow(TypeError);
      expect(() => new Game({} as unknown as string)).toThrow(TypeError);
      expect(() => new Game(null as unknown as string)).toThrow(TypeError);
      expect(() => new Game(undefined as unknown as string)).toThrow(TypeError);
      // @ts-expect-error
      expect(() => new Game()).toThrow(TypeError);
    });
  });

  describe("fetchGameData", () => {
    it("should fetch game data from the server", async () => {
      const game = new Game("https://example.com/game");
      const data = await game.fetchGameData();
      expect(data).toEqual(gameData);
      expect(game.mapSrc).toBe(gameData.mapUrl);
    });
  });

  describe("nextRound", () => {
    it("should fetch the next round data", async () => {
      const game = new Game("https://example.com/game");
      await game.fetchGameData();
      let nextRound = game.nextRound();
      expect(
        gameData.screenshots.map((screenshot) => screenshot.url)
      ).toContain(nextRound);

      nextRound = game.nextRound();
      expect(
        gameData.screenshots.map((screenshot) => screenshot.url)
      ).toContain(nextRound);
    });

    it("should throw an error if there are no more rounds", async () => {
      const game = new Game("https://example.com/game");
      await game.fetchGameData();
      game.nextRound();
      game.nextRound();
      expect(() => game.nextRound()).toThrow(Error);
    });
  });

  describe("totalScore", () => {
    it("should return the total score", async () => {
      const game = new Game("https://example.com/game");
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
});
