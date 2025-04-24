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
      expect(() => new Game(null)).toThrow(TypeError);
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
});
