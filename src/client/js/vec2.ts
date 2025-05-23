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
 * Two dimensional vector class.
 * @module Vec2
 */

/**
 * Represents a two-dimensional vector.
 */
export default class Vec2 {
  #x = 0;
  #y = 0;

  /**
   * Creates a new Vec2 object.
   * @param x - The x coordinate.
   * @param y - The y coordinate.
   */
  constructor(x?: number, y?: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Returns the x coordinate.
   * @returns The x coordinate.
   */
  get x(): number {
    return this.#x;
  }

  /**
   * Returns the y coordinate.
   * @returns The y coordinate.
   */
  get y(): number {
    return this.#y;
  }

  /**
   * Sets the x coordinate.
   * @param x The new x coordinate.
   */
  set x(x: number) {
    this.#x = Number(x) || 0;
  }

  /**
   * Sets the y coordinate.
   * @param y The new y coordinate.
   */
  set y(y: number) {
    this.#y = Number(y) || 0;
  }
}
