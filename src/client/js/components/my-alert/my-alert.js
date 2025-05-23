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
 * @module my-alert
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
   */
  #abortController = new AbortController();

  /**
   * The alert element.
   */
  #alert = null;

  /**
   * Creates an instance of the my-alert component.
   * @param type - The type of the alert.
   * @param message - The message of the alert.
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
   * @param name - The name of the attribute that has been changed.
   * @param oldValue - The old value of the attribute.
   * @param newValue - The new value of the attribute.
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
   * @returns - An array of attribute names.
   */
  static get observedAttributes() {
    return ["type"];
  }
}

if (!customElements.get("my-alert")) {
  customElements.define("my-alert", MyAlert);
}
