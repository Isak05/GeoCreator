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
 * The geocreator-map web component module.
 * @module geocreator-map
 */

import htmlTemplate from "./geocreator-map.html.js";
import cssTemplate from "./geocreator-map.css.js";
import Vec2 from "../../vec2.js";
import L from "leaflet";

/**
 * Represents a map element.
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
      htmlTemplate.content.cloneNode(true),
    );
    this.shadowRoot.appendChild(cssTemplate.content.cloneNode(true));

    this.#mapElement = this.shadowRoot.querySelector("#map");
  }

  /**
   * Called after the element is inserted into the DOM.
   */
  async connectedCallback() {
    this.#leafletMap = L.map(this.#mapElement, {
      center: [0, 0],
      zoom: 10,
      zoomSnap: 0,
      wheelPxPerZoomLevel: 80,
      maxBounds: [
        [-1, -1],
        [1, 1],
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

  /**
   * @returns The list of attributes to observe for changes.
   */
  static get observedAttributes(): string[] {
    return ["src", "allowplacingmarker"];
  }

  /**
   * Places a marker on the map at the specified coordinates and optionally attaches a click event callback.
   * @param x - The longitude of the marker's position.
   * @param y - The latitude of the marker's position.
   * @param options - Optional icon options to customize the marker's appearance.
   * @param callback - An optional function to be executed when the marker is clicked.
   */
  placeMarkerLink(
    x: number,
    y: number,
    options?: L.IconOptions,
    callback?: () => void,
  ) {
    const markerIcon = L.icon({
      iconAnchor: options?.iconAnchor ?? [12, 41],
      iconRetinaUrl: options?.iconRetinaUrl ?? "marker-icon-2x.png",
      iconSize: options?.iconSize ?? [25, 41],
      iconUrl: options?.iconUrl ?? "./img/marker-icon-blue.png",
      popupAnchor: options?.popupAnchor ?? [1, -34],
      shadowSize: options?.shadowSize ?? [41, 41],
      shadowUrl: options?.shadowUrl ?? "./img/marker-shadow.png",
      tooltipAnchor: options?.tooltipAnchor ?? [16, -28],
    });

    L.marker([y, x], { icon: markerIcon })
      .addTo(this.#mapLayerGroup)
      .on("click", () => {
        if (!callback) {
          return;
        }

        callback();
      });
  }

  /**
   * Draws a line on the map between two points specified by their coordinates.
   * @param x1 - The x-coordinate of the starting point.
   * @param y1 - The y-coordinate of the starting point.
   * @param x2 - The x-coordinate of the ending point.
   * @param y2 - The y-coordinate of the ending point.
   * @param options - Optional polyline options to customize the appearance of the line.
   */
  drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options?: L.PolylineOptions,
  ) {
    L.polyline(
      [
        [y1, x1],
        [y2, x2],
      ],
      options,
    ).addTo(this.#mapLayerGroup);
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

    // Clear any image overlays from the map
    this.#leafletMap.eachLayer((layer) => {
      if (layer instanceof L.ImageOverlay) {
        this.#leafletMap.removeLayer(layer);
      }
    });
  }

  /**
   * Resets the map to its initial state by reloading it using the provided source URL.
   */
  reset() {
    this.#loadMap(this.src);
  }

  /**
   * Loads the specified URL as a map image.
   * @param url The url of the map image to load.
   * @returns A promise that resolves to the loaded image overlay.
   */
  async #loadMap(url: string): Promise<L.ImageOverlay> {
    this.clear();

    const { width, height } = await this.#getImageResolutionFromUrl(url);
    const average = (width + height) / 2;
    const normalizedWidth = width / average;
    const normalizedHeight = height / average;

    const overlay = L.imageOverlay(
      url,
      [
        [-normalizedHeight / 2, -normalizedWidth / 2],
        [normalizedHeight / 2, normalizedWidth / 2],
      ],
      {
        interactive: true,
      },
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
      this.#invalidateSizeLoop.bind(this),
    );
  }

  /**
   * Handles the placement of a marker on the map when a Leaflet mouse event occurs.
   * @param event - The Leaflet mouse event containing the latitude and longitude of the click location.
   * @fires markerplaced - A custom event dispatched when a marker is placed on the map.
   */
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
      }),
    );
  }

  /**
   * Retrieves the resolution (width and height) of an image from a given URL.
   * @param url - The URL of the image to retrieve the resolution for.
   * @returns A promise that resolves to an object containing the width and height of the image.
   */
  async #getImageResolutionFromUrl(
    url: string,
  ): Promise<{ width: number; height: number }> {
    const image = document.createElement("img");
    image.src = url;

    return new Promise((resolve) => {
      /**
       * The image is loaded, and the width and height are returned in the promise.
       */
      image.onload = () => {
        resolve({ width: image.width, height: image.height });
      };
    });
  }

  /**
   * Gets the source URL of the map.
   * @returns The source URL of the map, or `null` if not set.
   */
  get src(): string {
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
   * @returns The value of the `allowplacingmarker` attribute, or `null` if the attribute is not set.
   */
  get allowplacingmarker(): boolean {
    return this.getAttribute("allowplacingmarker") !== null;
  }

  /**
   * Sets the `allowplacingmarker` attribute on the element.
   * If a non-null value is provided, the attribute is set to the given value.
   * If `null` is provided, the attribute is removed from the element.
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
   * @returns An object containing the `x` (longitude) and `y` (latitude) coordinates of the marker,
   *          or `null` if the marker is not set.
   */
  get markerPosition(): Vec2 {
    if (!this.#mapMarker) {
      return null;
    }

    return new Vec2(
      this.#mapMarker.getLatLng().lng,
      this.#mapMarker.getLatLng().lat,
    );
  }
}

if (!customElements.get("geocreator-map")) {
  customElements.define("geocreator-map", GeocreatorMap);
}
