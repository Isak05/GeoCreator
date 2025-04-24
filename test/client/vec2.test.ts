/**
 * Tests for Vec2 class.
 *
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import Vec2 from "../../src/client/js/vec2";

describe("Vec2", () => {
  describe("constructor", () => {
    it("should create a Vec2 object with default values", () => {
      const vec = new Vec2();
      expect(vec.x).toBe(0);
      expect(vec.y).toBe(0);
    });

    it("should create a Vec2 object with specified values", () => {
      const vec = new Vec2(3, 4);
      expect(vec.x).toBe(3);
      expect(vec.y).toBe(4);
    });

    it("should create a Vec2 object with default values when passed invalid values", () => {
      let vec = new Vec2(NaN, NaN);
      expect(vec.x).toBe(0);
      expect(vec.y).toBe(0);
    });
  });

  describe("set values", () => {
    it("should set x and y values", () => {
      const vec = new Vec2();
      vec.x = 5;
      vec.y = 6;
      expect(vec.x).toBe(5);
      expect(vec.y).toBe(6);
    });

    it("should set x and y values to default when passed invalid values", () => {
      const vec = new Vec2();
      vec.x = NaN;
      vec.y = NaN;
      expect(vec.x).toBe(0);
      expect(vec.y).toBe(0);
    });
  });
});
