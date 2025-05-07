/**
 * The geocreator-map web component module.
 *
 * @module geocreator-map
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import htmlTemplate from "./geocreator-map.html.js";
import cssTemplate from "./geocreator-map.css.js";

declare const L: any;

/**
 * Represents a map element.
 *
 * @fires markerplaced - Fired when a marker is placed on the map.
 */
export default class GeocreatorMap extends HTMLElement {
  /**
   * The map div element
   */
  #mapElement: HTMLDivElement = null;

  /**
   * The Leaflet map instance.
   */
  #leafletMap: L.Map = null;

  /**
   * The Leaflet map layer group.
   */
  #mapLayerGroup: L.LayerGroup = null;

  /**
   * The Leaflet map marker.
   */
  #mapMarker: L.Marker = null;

  /**
   * Abort controller controlling event listeners.
   */
  #abortController: AbortController = new AbortController();

  /**
   * The last animation frame ID.
   * Used to cancel the animation frame when the element is removed from the DOM.
   */
  #lastAnimationFrameId: number = null;

  /**
   * Creates an instance of the current type.
   */
  constructor() {
    super();

    // Attach a shadow DOM tree to this element and
    // append the template to the shadow root.
    this.attachShadow({ mode: "open" }).appendChild(
      htmlTemplate.content.cloneNode(true)
    );
    this.shadowRoot.appendChild(cssTemplate.content.cloneNode(true));

    this.#mapElement = this.shadowRoot.querySelector("#map");
  }

  /**
   * Called after the element is inserted into the DOM.
   */
  async connectedCallback() {
    this.#leafletMap = L.map(this.#mapElement, {
      center: [0.5, 0.5],
      zoom: 10,
      zoomSnap: 0,
      wheelPxPerZoomLevel: 80,
      maxBounds: [
        [-0.5, -0.5],
        [1.5, 1.5],
      ],
      minZoom: 8,
      maxBoundsViscosity: 0.5,
      attributionControl: false,
    });

    this.#mapLayerGroup = L.layerGroup().addTo(this.#leafletMap);

    this.#invalidateSizeLoop();
  }

  /**
   * Called when an attribute of the element changes.
   *
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
    cancelAnimationFrame(this.#lastAnimationFrameId);
  }

  static get observedAttributes() {
    return ["src", "allowplacingmarker"];
  }

  /**
   * Places a marker on the map at the specified coordinates and optionally attaches a click event callback.
   *
   * @param x - The longitude of the marker's position.
   * @param y - The latitude of the marker's position.
   * @param callback - An optional function to be executed when the marker is clicked.
   */
  placeMarkerLink(x: number, y: number, callback?: Function) {
    L.marker([y, x]).addTo(this.#mapLayerGroup).on("click", (event: L.LeafletMouseEvent) => {
      if (!callback) {
        return;
      }

      callback();
    });
  }


  /**
   * Clears the map or resets its state.
   * This method is intended to remove all markers, layers, or other elements
   * from the map, effectively resetting it to an empty state.
   */
  clear() {
    this.#mapLayerGroup.clearLayers();
    this.#mapMarker?.remove();
    this.#mapMarker = null;
  }

  /**
   * Loads the specified URL as a map image.
   *
   * @param url The url of the map image to load.
   */
  #loadMap(url: string): L.ImageOverlay {
    this.clear()

    const overlay = L.imageOverlay(
      url,
      [
        [0, 0],
        [1, 1],
      ],
      {
        interactive: true,
      }
    ).addTo(this.#leafletMap);

    // Handle click events on the overlay to place a marker.
    overlay.addEventListener("click", this.#handlePlaceMarker.bind(this));

    // Set the map zoom and location to just fit the loaded map.
    this.#leafletMap.fitBounds(overlay.getBounds());

    return overlay;
  }

  /**
   * Continously invalidates the size of the map, allowing for dynamic resizing.
   */
  #invalidateSizeLoop() {
    this.#leafletMap.invalidateSize(false);

    this.#lastAnimationFrameId = requestAnimationFrame(
      this.#invalidateSizeLoop.bind(this)
    );
  }

  #handlePlaceMarker(event: L.LeafletMouseEvent) {
    if (!this.hasAttribute("allowplacingmarker")) {
      return;
    }

    if (this.#mapMarker) {
      this.#mapMarker?.remove();
    }

    this.#mapMarker = L.marker(event.latlng);
    this.#mapLayerGroup.addLayer(this.#mapMarker);
    
    this.dispatchEvent(
      new CustomEvent("markerplaced", {
        detail: {
          y: event.latlng.lat,
          x: event.latlng.lng,
        },
      })
      
    );
  }

  /**
   * Gets the source URL of the map.
   */
  get src() {
    return this.getAttribute("src");
  }

  /**
   * Sets the source URL of the map.
   */
  set src(value: string) {
    if (value) {
      this.setAttribute("src", value);
      this.#loadMap(value);
    } else {
      this.removeAttribute("src");
    }
  }

  /**
   * Gets the value of the `allowplacingmarker` attribute.
   * This attribute determines whether placing markers on the map is allowed.
   * 
   * @returns The value of the `allowplacingmarker` attribute, or `null` if the attribute is not set.
   */
  get allowplacingmarker(): boolean {
    return this.getAttribute("allowplacingmarker") !== null;
  }

  /**
   * Sets the `allowplacingmarker` attribute on the element.
   * If a non-null value is provided, the attribute is set to the given value.
   * If `null` is provided, the attribute is removed from the element.
   *
   * @param value - The value to set for the `allowplacingmarker` attribute. 
   *                If `null`, the attribute will be removed.
   */
  set allowplacingmarker(value: string | boolean) {
    if (value !== null && value !== false) {
      this.setAttribute("allowplacingmarker", value.toString());
    } else {
      this.removeAttribute("allowplacingmarker");
    }
  }

  /**
   * Retrieves the current position of the map marker.
   * If no marker is present on the map, returns `null`.
   *
   * @returns An object containing the `x` (longitude) and `y` (latitude) coordinates of the marker,
   *          or `null` if the marker is not set.
   */
  get markerPosition() {
    if (!this.#mapMarker) {
      return null;
    }

    return {
      x: this.#mapMarker.getLatLng().lng,
      y: this.#mapMarker.getLatLng().lat,
    };
  }
}
customElements.define("geocreator-map", GeocreatorMap);
