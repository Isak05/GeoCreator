/**
 * The geocreator-map web component module.
 * @module geocreator-map
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import htmlTemplate from "./geocreator-rating.html.js";
import cssTemplate from "./geocreator-rating.css.js";

/**
 * Represents a five star rating element.
 * @fires change - Fired when the rating changes.
 */
export default class GeocreatorRating extends HTMLElement {
  /**
   * Abort controller controlling event listeners.
   */
  #abortController: AbortController = new AbortController();

  /**
   * The rating.
   */
  #rating: number = null;

  /**
   * Creates an instance of the current type.
   */
  constructor() {
    super();

    // Attach a shadow DOM tree to this element and
    // append the template to the shadow root.
    this.attachShadow({ mode: "open" }).appendChild(
      htmlTemplate.content.cloneNode(true),
    );
    this.shadowRoot.appendChild(cssTemplate.content.cloneNode(true));
  }

  /**
   * Called after the element is inserted into the DOM.
   */
  async connectedCallback() {
    for (const input of this.shadowRoot.querySelectorAll(
      "input[name='rating']",
    )) {
      input.addEventListener("change", (event) => {
        const target = event.target as HTMLInputElement;
        this.rating = Number.parseInt(target.value);
      });
    }
  }

  /**
   * Called when an attribute of the element changes.
   * @param name The name of the attribute that changed
   * @param oldValue The old value of the attribute
   * @param newValue The new value of the attribute
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (newValue === oldValue) {
      return;
    }

    this[name] = newValue;
  }

  /**
   * Called after the element has been removed from the DOM.
   */
  disconnectedCallback() {
    this.#abortController.abort();
  }

  /**
   * @returns The list of attributes to observe for changes.
   */
  static get observedAttributes(): string[] {
    return ["rating"];
  }

  /**
   * @returns The rating.
   */
  get rating(): number {
    return this.#rating;
  }

  /**
   * Sets the rating.
   * @param value The new rating.
   * @throws {RangeError} If the rating is not between 1 and 5.
   * @throws {TypeError} If the rating is not a number.
   */
  set rating(value: number) {
    const newRating = Number.parseInt(value.toString());

    if (newRating < 1 || newRating > 5) {
      throw new RangeError("Rating must be between 1 and 5");
    }
    if (!Number.isFinite(newRating)) {
      throw new TypeError("Rating must be a number");
    }
    if (newRating === this.#rating) {
      return;
    }

    this.#rating = newRating;

    // Check the correct radio button for the new rating
    (
      this.shadowRoot.querySelector(
        `input[value='${newRating}']`,
      ) as HTMLInputElement
    ).checked = true;

    // Dispatch a change event with the new rating
    this.dispatchEvent(new CustomEvent("change", { detail: newRating }));
  }
}

if (!customElements.get("geocreator-rating")) {
  customElements.define("geocreator-rating", GeocreatorRating);
}
