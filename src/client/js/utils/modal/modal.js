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
 * @file A class representing a bootstrap modal dialog.
 * @module utils/modal
 */

import modalTemplate from "./modal.html.js";
import * as bootstrap from "bootstrap";

/**
 * A class representing a modal dialog.
 */
export default class Modal {
  static PromptType = Object.freeze({
    YESNO: 0,
    OK: 1,
    CANCELDELETE: 2,
  });

  /**
   * The modal element.
   */
  #modalElement = null;

  /**
   * The modal title element.
   */
  #modalTitleElement = null;

  /**
   * The modal body element.
   */
  #modalBodyElement = null;

  /**
   * The Bootstrap modal instance.
   */
  #modal = null;

  /**
   * The AbortController instance to manage event listeners.
   */
  #abortController = new AbortController();

  /**
   * Creates an instance of a modal with the specified title and body content.
   * @param title - The title of the modal.
   * @param body - The body content of the modal.
   * @param promptType - The type of prompt (OK or Yes/No).
   */
  constructor(title, body, promptType = Modal.PromptType.YESNO) {
    this.#modalElement =
      modalTemplate.content.cloneNode(true).firstElementChild;
    this.#modalTitleElement = this.#modalElement.querySelector(".modal-title");
    this.#modalBodyElement = this.#modalElement.querySelector(".modal-body");

    if (typeof title === "string") {
      this.#modalTitleElement.textContent = title;
    } else if (title instanceof HTMLElement) {
      this.#modalTitleElement.innerHTML = "";
      this.#modalTitleElement.appendChild(title);
    }

    if (typeof body === "string") {
      this.#modalBodyElement.textContent = body;
    } else if (body instanceof HTMLElement) {
      this.#modalBodyElement.innerHTML = "";
      this.#modalBodyElement.appendChild(body);
    }

    this.#adjustPromptButtons(promptType);

    document.body.appendChild(this.#modalElement);

    this.#modal = new bootstrap.Modal(this.#modalElement);
  }

  /**
   * Adjusts the text and visibility of the modal's primary and secondary buttons
   * based on the specified prompt type.
   * @param type - The type of prompt to display.
   */
  #adjustPromptButtons(type) {
    const primary = this.#modalElement.querySelector(".btn-primary");
    const secondary = this.#modalElement.querySelector(".btn-secondary");

    switch (type) {
      case Modal.PromptType.YESNO:
        primary.textContent = "Yes";
        secondary.textContent = "No";
        break;
      case Modal.PromptType.OK:
        primary.textContent = "OK";
        secondary.classList.add("d-none");
        break;
      case Modal.PromptType.CANCELDELETE:
        primary.textContent = "Delete";
        primary.classList.add("btn-danger");
        secondary.textContent = "Cancel";
        break;
    }
  }

  /**
   * Displays the delete confirmation modal and returns a promise that resolves based on user action.
   * @returns A promise that resolves to `true` if the user confirms the delete,
   * or `false` if the modal is hidden without confirmation.
   */
  show() {
    return new Promise((resolve) => {
      this.#modal.show();

      // Modal has been hidden without the user confirming the delete.
      this.#modalElement.addEventListener(
        "hidden.bs.modal",
        () => {
          this.#abortController.abort();
          this.#modalElement.remove();

          resolve(false);
        },
        { signal: this.#abortController.signal },
      );

      // User has confirmed the delete.
      this.#modalElement.querySelector(".btn-primary")?.addEventListener(
        "click",
        async () => {
          this.#modal.hide();

          resolve(true);
        },
        { signal: this.#abortController.signal },
      );
    });
  }
}
