/**
 * Two dimensional vector class.
 * @module Vec2
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
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
