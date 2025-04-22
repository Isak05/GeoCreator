/**
 * The geocreator-timer web component module.
 *
 * @module geocreator-timer
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 * @version 1.1.2
 */

// Define template.
const template = document.createElement("template");
template.innerHTML = /* html */ `
  <p id="timer-text">Timer</p>
`;

customElements.define(
  "geocreator-timer",
  /**
   * Represents a geocreator-timer element.
   *
   * @event geocreator-timer#timeout
   */
  class extends HTMLElement {
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
    #totalTime: number = 20_000;

    /**
     * Creates an instance of the current type.
     */
    constructor() {
      super();

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: "open" }).appendChild(
        template.content.cloneNode(true)
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
     */
    attributeChangedCallback(name: string, oldValue: any, newValue: any) {
      if (oldValue === newValue) {
        return;
      }

      this[name] = newValue;
    }

    /**
     * Watches attributes for changes on the element.
     */
    static get observedAttributes(): string[] {
      return ["totalTime", "stopped"];
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
     */
    get stopped(): boolean {
      return this.#stopped;
    }

    /**
     * Sets how long the timer should run for measured in milliseconds. Also restarts the timer.
     */
    set totalTime(value: number) {
      const numberValue = Number(value);

      if (!Number.isFinite(numberValue)) {
        return;
      }

      this.#totalTime = numberValue;
      this.#startTime = Date.now();
      this.#timePassed = 0;
    }

    /**
     * Gets how long the timer should run for in total, measured in milliseconds.
     */
    get totalTime(): number {
      return this.#totalTime;
    }

    /**
     * Gets how much time is left on the timer, measured in milliseconds.
     */
    get timeLeft(): number {
      return this.#totalTime - this.#timePassed;
    }

    /**
     * Run once to continuously update the countdown timer display until `this.stopped` is set to true.
     * Dispatches a `timeout` event when the time is up.
     *
     * @fires geocreator-timer#timeout
     */
    #update() {
      const previousTimePassed = this.#timePassed;
      this.#timePassed = Date.now() - this.#startTime;
      const timeLeft = this.timeLeft;
      const previousTimeLeft = this.#totalTime - previousTimePassed;
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
);
