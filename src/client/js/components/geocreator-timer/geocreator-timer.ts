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
 * The geocreator-timer web component module.
 * @module geocreator-timer
 */

// Define template.
const template = document.createElement("template");
template.innerHTML = /* html */ `
  <style>
    #timer-text {
      margin: 0;
    }
  </style>

  <p id="timer-text">Timer</p>
`;

/**
 * Represents a geocreator-timer element.
 * @event geocreator-timer#timeout
 */
export default class GeocreatorTimer extends HTMLElement {
  /**
   * The element saying how much time is left.
   */
  #timerText: HTMLParagraphElement = null;

  /**
   * When the timer started. Measured in milliseconds since the epoch.
   */
  #startTime: number = Date.now();

  /**
   * How much time has passed. Measured in millisecond.
   */
  #timePassed: number = 0;

  /**
   * Whether the countdown timer has been stopped.
   */
  #stopped: boolean = false;

  /**
   * How long the timer should run. Measured in milliseconds.
   */
  #totaltime: number = 20_000;

  /**
   * Creates an instance of the current type.
   */
  constructor() {
    super();

    // Attach a shadow DOM tree to this element and
    // append the template to the shadow root.
    this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true),
    );

    // Retreive elements
    this.#timerText = this.shadowRoot.querySelector("#timer-text");
  }

  /**
   * Called after the element is inserted into the DOM.
   */
  async connectedCallback() {
    this.#update();
  }

  /**
   * Called after the element has been removed from the DOM.
   */
  disconnectedCallback() {
    this.stopped = true;
  }

  /**
   * Called by the browser engine when an attribute changes.
   * @param name The name of the attribute that changed
   * @param oldValue The old value of the attribute
   * @param newValue The new value of the attribute
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) {
      return;
    }

    this[name] = newValue;
  }

  /**
   * Watches attributes for changes on the element.
   * @returns The list of attributes to watch for changes.
   */
  static get observedAttributes(): string[] {
    return ["totaltime", "stopped"];
  }

  /**
   * Sets the stopped state of the countdown timer.
   */
  set stopped(value: boolean) {
    this.#stopped = value !== null && value !== false;

    if (!this.#stopped) {
      this.#startTime = Date.now() - this.#timePassed;
      this.#update();
    }
  }

  /**
   * Gets the stopped state of the countdown timer.
   * @returns True if the timer is stopped, false otherwise.
   */
  get stopped(): boolean {
    return this.#stopped;
  }

  /**
   * Sets how long the timer should run for measured in milliseconds. Also restarts the timer.
   */
  set totaltime(value: number) {
    const numberValue = Number(value);

    if (!Number.isFinite(numberValue)) {
      return;
    }

    this.#totaltime = numberValue;
    this.#startTime = Date.now();
    this.#timePassed = 0;
  }

  /**
   * Gets how long the timer should run for in total, measured in milliseconds.
   * @returns The total time the timer should run for.
   */
  get totaltime(): number {
    return this.#totaltime;
  }

  /**
   * Gets how much time is left on the timer, measured in milliseconds.
   * @returns The time left on the timer.
   */
  get timeleft(): number {
    return this.#totaltime - this.#timePassed;
  }

  /**
   * Run once to continuously update the countdown timer display until `this.stopped` is set to true.
   * Dispatches a `timeout` event when the time is up.
   * @fires geocreator-timer#timeout
   */
  #update() {
    const previousTimePassed = this.#timePassed;
    this.#timePassed = Date.now() - this.#startTime;
    const timeLeft = this.timeleft;
    const previousTimeLeft = this.#totaltime - previousTimePassed;
    const seconds = Math.ceil(timeLeft / 1_000);

    if (timeLeft > 0) {
      this.#timerText.textContent = `${seconds}s`;
    } else if (previousTimeLeft > 0) {
      this.#timerText.textContent = "Time is up!";
      this.dispatchEvent(new CustomEvent("timeout"));
    }

    if (!this.stopped) {
      requestAnimationFrame(this.#update.bind(this));
    }
  }
}

if (!customElements.get("geocreator-timer")) {
  customElements.define("geocreator-timer", GeocreatorTimer);
}
