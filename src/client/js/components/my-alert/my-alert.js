/**
 * @module my-alert
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 * @version 1.0.0
 */

import htmlTemplate from "./my-alert.html.js";
import * as bootstrap from "bootstrap";

const alertTypes = Object.freeze([
  "alert-primary",
  "alert-secondary",
  "alert-success",
  "alert-danger",
  "alert-warning",
  "alert-info",
  "alert-light",
  "alert-dark",
]);

/**
 * Represents a alert.
 */
export default class MyAlert extends HTMLElement {
  /**
   * Used to abort eventlisteners when the element is removed from the DOM.
   *
   * @type {AbortController}
   */
  #abortController = new AbortController();

  /**
   * The alert element.
   */
  #alert = null;

  /**
   * Creates an instance of the my-alert component.
   *
   * @param {string} type - The type of the alert.
   * @param {string} message - The message of the alert.
   */
  constructor(type = "info", message = "") {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(htmlTemplate.content.cloneNode(true));

    this.#alert = this.shadowRoot.querySelector("#alert");
    this.shadowRoot.querySelector("slot").textContent = message;

    this.setAttribute("type", type);
  }

  /**
   * Called after the element is inserted into the DOM.
   */
  connectedCallback() {
    this.#alert.addEventListener(
      "click",
      () => {
        const alert = new bootstrap.Alert(this.#alert);
        alert.close();
      },
      { signal: this.#abortController.signal },
    );
  }

  /**
   * Called after the element has been removed from the DOM.
   */
  disconnectedCallback() {
    this.#abortController.abort();
  }

  /**
   * Called when an attribute has been added, removed, updated, or replaced.
   *
   * @param {string} name - The name of the attribute that has been changed.
   * @param {string} oldValue - The old value of the attribute.
   * @param {string} newValue - The new value of the attribute.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    switch (name) {
      case "type": {
        const newAlertType = `alert-${newValue}`;
        if (!alertTypes.includes(newAlertType)) {
          return;
        }

        this.#alert.classList.remove(...alertTypes);
        this.#alert.classList.add(newAlertType);
        break;
      }
    }
  }

  /**
   * Describes which attributes the element observes.
   *
   * @returns {string[]} - An array of attribute names.
   */
  static get observedAttributes() {
    return ["type"];
  }
}

if (!customElements.get("my-alert")) {
  customElements.define("my-alert", MyAlert);
}
