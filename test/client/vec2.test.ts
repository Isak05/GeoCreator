/*
 * GeoCreator game and creation platform.
 * Copyright (C) 2025 Isak Johansson Weckstén
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, see
 * <https://www.gnu.org/licenses/>.
 */

/**
 * Tests for Vec2 class.
 * @module test/client/vec2.test
 */

import Vec2 from "../../src/client/js/vec2.ts";

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
      const vec = new Vec2(NaN, NaN);
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
